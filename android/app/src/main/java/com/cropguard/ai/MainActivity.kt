package com.cropguard.ai

import android.os.Bundle
import android.util.Log
import com.getcapacitor.BridgeActivity
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.InitializationStatus

class MainActivity : BridgeActivity() {

    companion object {
        private const val TAG = "CropGuardAdMob"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Google Mobile Ads (AdMob) with detailed error & status logging
        try {
            Log.d(TAG, "Initializing Google Mobile Ads SDK (App ID: ca-app-pub-6652067022010690~4420290370)...")
            MobileAds.initialize(this) { initializationStatus: InitializationStatus ->
                val statusMap = initializationStatus.adapterStatusMap
                for ((adapterClass, status) in statusMap) {
                    Log.d(TAG, "AdMob Adapter: $adapterClass | State: ${status.initializationState} | Description: ${status.description} | Latency: ${status.latency}")
                }
                Log.d(TAG, "Google Mobile Ads SDK initialization completed successfully.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "CRITICAL: Google Mobile Ads SDK initialization threw exception: ${e.message}", e)
        }

        // Initialize Firebase Cloud Messaging Channels & Token
        try {
            com.cropguard.ai.services.CropGuardMessagingService.createNotificationChannels(this)
            com.cropguard.ai.services.FcmManager.fetchAndRegisterToken(this)
        } catch (e: Exception) {
            Log.w(TAG, "FCM init notice: ${e.message}")
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
