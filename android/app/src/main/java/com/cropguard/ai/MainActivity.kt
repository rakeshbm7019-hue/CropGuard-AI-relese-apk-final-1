package com.cropguard.ai

import android.os.Bundle
import android.util.Log
import com.getcapacitor.BridgeActivity
import com.google.android.gms.ads.MobileAds

class MainActivity : BridgeActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Google Mobile Ads (AdMob)
        try {
            MobileAds.initialize(this) { status ->
                Log.d("CropGuardAI", "AdMob Mobile Ads Initialized: $status")
            }
        } catch (e: Exception) {
            Log.w("CropGuardAI", "AdMob init error: ${e.message}")
        }

        // Initialize Firebase Cloud Messaging Channels & Token
        try {
            com.cropguard.ai.services.CropGuardMessagingService.createNotificationChannels(this)
            com.cropguard.ai.services.FcmManager.fetchAndRegisterToken(this)
        } catch (e: Exception) {
            Log.w("CropGuardAI", "FCM init notice: ${e.message}")
        }

        // Notification Permission for Android 13+ (API 33+)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 101)
            }
        }
    }
}
