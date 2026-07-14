package com.donttextyourex.interceptor

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.donttextyourex.MainActivity
import com.donttextyourex.sobriety.SobrietyTestActivity

/**
 * Launched by [AppInterceptorService] with FLAG_ACTIVITY_NEW_TASK when a
 * target social media app is detected in the foreground during Party Mode.
 * Overlays the offending app with a full-screen sarcastic guard and offers
 * the Sobriety Test as the only bypass.
 *
 * Manifest declaration:
 * <activity android:name=".interceptor.AntiPostActivity"
 *     android:excludeFromRecents="true"
 *     android:launchMode="singleTop"
 *     android:theme="@style/Theme.DontTextYourEx" />
 */
class AntiPostActivity : ComponentActivity() {

    companion object {
        const val EXTRA_DETECTED_PACKAGE = "detected_package"

        data class AppWarning(val appName: String, val message: String, val accentColor: Color)

        private val APP_MESSAGES = mapOf(
            "com.facebook.katana" to AppWarning(
                appName = "Facebook",
                message = "⚠️ СТОП! Не пиши цей пост і не коментуй колишню! " +
                    "Ти бухий, зранку буде соромно. Видали фейсбук з багатозадачності або пройди тест!",
                accentColor = Color(0xFF1877F2)
            ),
            "com.instagram.android" to AppWarning(
                appName = "Instagram",
                message = "⚠️ Сторіз з клубу під сумну музику? Серйозно? " +
                    "Сховай телефон і йди танцювати!",
                accentColor = Color(0xFFE4405F)
            ),
            "org.telegram.messenger" to AppWarning(
                appName = "Telegram",
                message = "⚠️ Писати 'Спиш?' заборонено законом цієї вечірки. " +
                    "Телефон заблоковано!",
                accentColor = Color(0xFF0088CC)
            ),
            "com.whatsapp" to AppWarning(
                appName = "WhatsApp",
                message = "⚠️ Писати 'Спиш?' заборонено законом цієї вечірки. " +
                    "Телефон заблоковано!",
                accentColor = Color(0xFF25D366)
            )
        )

        private val DEFAULT_WARNING = AppWarning(
            appName = "Unknown App",
            message = "⚠️ This app is blocked during Party Mode. Put the phone down.",
            accentColor = Color(0xFFFF2D78)
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val detectedPackage = intent.getStringExtra(EXTRA_DETECTED_PACKAGE) ?: ""
        val warning = APP_MESSAGES[detectedPackage] ?: DEFAULT_WARNING

        setContent {
            MaterialTheme {
                AntiPostScreen(
                    warning = warning,
                    onPassTest = {
                        val intent = Intent(this, SobrietyTestActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK
                            putExtra("action", "app")
                            putExtra("app", detectedPackage)
                        }
                        startActivity(intent)
                        finish()
                    },
                    onBackToSafety = {
                        val intent = Intent(this, MainActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                                    Intent.FLAG_ACTIVITY_CLEAR_TOP
                        }
                        startActivity(intent)
                        finish()
                    }
                )
            }
        }
    }
}

@Composable
fun AntiPostScreen(
    warning: AntiPostActivity.AppWarning,
    onPassTest: () -> Unit,
    onBackToSafety: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0F))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Pulsing warning circle
        Box(
            modifier = Modifier
                .size(96.dp)
                .clip(CircleShape)
                .background(Color(0x1AEF4444)),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "⚠️", fontSize = 44.sp)
        }

        Spacer(modifier = Modifier.height(24.dp))

        // App name badge
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(warning.accentColor)
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Text(
                text = warning.appName,
                fontSize = 12.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Title
        Text(
            text = "DRINKER'S REMORSE",
            fontSize = 28.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFFFF2D78)
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Warning message
        Text(
            text = warning.message,
            fontSize = 16.sp,
            color = Color.White,
            textAlign = TextAlign.Center,
            lineHeight = 24.sp
        )

        Spacer(modifier = Modifier.height(40.dp))

        // Pass sobriety test button
        Button(
            onClick = onPassTest,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFFF2D78)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text(
                text = "PASS SOBRIETY TEST",
                fontWeight = FontWeight.Black,
                fontSize = 14.sp
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Back to safety button
        OutlinedButton(
            onClick = onBackToSafety,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = Color(0xFFFF6EC7)
            ),
            border = BorderStroke(1.dp, Color(0x40FF2D78)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text(
                text = "BACK TO SAFETY",
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }
    }
}