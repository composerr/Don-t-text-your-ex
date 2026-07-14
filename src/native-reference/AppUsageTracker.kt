package com.donttextyourex.interceptor

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Process

/**
 * Wraps UsageStatsManager to query the current foreground application.
 * Uses PACKAGE_USAGE_STATS — a legitimate special permission granted via
 * Android Settings → Usage Data Access. No AccessibilityService required.
 */
class AppUsageTracker(private val context: Context) {

    private val usageStatsManager: UsageStatsManager by lazy {
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    }

    /**
     * Checks whether the user has granted PACKAGE_USAGE_STATS.
     */
    fun hasUsageStatsPermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.unsafeCheckOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    /**
     * Returns the package name of the app currently in the foreground,
     * or null if it cannot be determined (permission missing, no data).
     */
    fun getForegroundPackageName(): String? {
        if (!hasUsageStatsPermission()) return null

        val now = System.currentTimeMillis()
        // Query usage stats for the last 10 seconds
        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_BEST,
            now - 10_000,
            now
        ) ?: return null

        // Find the most recently used app
        return stats
            .filter { it.lastTimeUsed > 0 }
            .maxByOrNull { it.lastTimeUsed }
            ?.packageName
    }

    /**
     * Convenience method: returns the matched target package if one of the
     * [targetPackages] is currently in the foreground, null otherwise.
     */
    fun isTargetAppInForeground(targetPackages: Set<String>): String? {
        val foreground = getForegroundPackageName() ?: return null
        return if (targetPackages.contains(foreground)) foreground else null
    }
}