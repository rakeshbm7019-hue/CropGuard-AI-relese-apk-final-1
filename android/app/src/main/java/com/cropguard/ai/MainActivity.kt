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

        // Request Native Location & Notification Permissions on Startup
        val permissionsToRequest = mutableListOf<String>()

        if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(android.Manifest.permission.ACCESS_FINE_LOCATION)
        }
        if (checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(android.Manifest.permission.ACCESS_COARSE_LOCATION)
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(android.Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        if (permissionsToRequest.isNotEmpty()) {
            requestPermissions(permissionsToRequest.toTypedArray(), 101)
        }
    }
}
