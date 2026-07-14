package com.donttextyourex.interceptor

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat

/**
 * Lightweight foreground service that polls the foreground package every 1.5 seconds
 * ONLY while Party Mode is active. If a target social media app is detected,
 * launches [AntiPostActivity] with FLAG_ACTIVITY_NEW_TASK to overlay it.
 *
 * Google Play compliance:
 * - Does NOT use AccessibilityService.
 * - Does NOT use SYSTEM_ALERT_WINDOW / draw-over-other-apps.
 * - Uses FOREGROUND_SERVICE_TYPE_SPECIAL_USE (declared in manifest).
 * - Relies on PACKAGE_USAGE_STATS, a legitimate special permission.
 *
 * Manifest:
 * <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
 * <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
 * <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
 *     tools:ignore="ProtectedPermissions" />
 *
 * <service
 *     android:name=".interceptor.AppInterceptorService"
 *     android:foregroundServiceType="specialUse">
 *     <property
 *         android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
 *         android:value="Blocks social media apps during user-activated Party Mode to prevent regretful drunk messaging." />
 * </service>
 */
class AppInterceptorService : Service() {

    companion object {
        const val CHANNEL_ID = "party_mode_interceptor"
        const val NOTIFICATION_ID = 1001
        const val POLL_INTERVAL_MS = 1500L

        val TARGET_PACKAGES = setOf(
            "com.facebook.katana",      // Facebook
            "com.instagram.android",    // Instagram
            "org.telegram.messenger",   // Telegram
            "com.whatsapp"              // WhatsApp
        )

        const val EXTRA_DETECTED_PACKAGE = "detected_package"
    }

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var usageTracker: AppUsageTracker
    private var lastInterceptedPackage: String? = null

    private val pollRunnable = object : Runnable {
        override fun run() {
            checkForegroundApp()
            handler.postDelayed(this, POLL_INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        usageTracker = AppUsageTracker(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
        handler.post(pollRunnable)
        return START_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(pollRunnable)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun checkForegroundApp() {
        val detectedPackage = usageTracker.isTargetAppInForeground(TARGET_PACKAGES)

        if (detectedPackage != null && detectedPackage != lastInterceptedPackage) {
            // A target app just entered the foreground — intercept it
            lastInterceptedPackage = detectedPackage
            launchAntiPostActivity(detectedPackage)
        } else if (detectedPackage == null) {
            // User left the target app — reset so we can intercept again next time
            lastInterceptedPackage = null
        }
    }

    private fun launchAntiPostActivity(packageName: String) {
        val intent = Intent(this, AntiPostActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(EXTRA_DETECTED_PACKAGE, packageName)
        }
        startActivity(intent)
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Party Mode Active")
            .setContentText("App guard is running. Stay strong.")
            .setSmallIcon(android.R.drawable.ic_lock_silent_mode_off)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Party Mode Guard",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Monitors for blocked apps during Party Mode"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }
}