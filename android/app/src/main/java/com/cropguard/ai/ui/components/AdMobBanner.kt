package com.cropguard.ai.ui.components

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError

// Google AdMob Banner Ad Unit ID
const val ADMOB_BANNER_UNIT_ID = "ca-app-pub-6652067022010690/7039101892"
private const val TAG = "CropGuardAdMobBanner"

@Composable
fun AdMobBanner(
    modifier: Modifier = Modifier,
    adUnitId: String = ADMOB_BANNER_UNIT_ID
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
            .padding(vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        AndroidView(
            modifier = Modifier.fillMaxWidth(),
            factory = { context ->
                AdView(context).apply {
                    setAdSize(AdSize.BANNER)
                    this.adUnitId = adUnitId
                    adListener = object : AdListener() {
                        override fun onAdLoaded() {
                            Log.d(TAG, "Banner loaded for unit $adUnitId")
                        }

                        override fun onAdFailedToLoad(adError: LoadAdError) {
                            Log.e(
                                TAG,
                                "Banner failed to load. Code: ${adError.code} | Message: ${adError.message} | Domain: ${adError.domain}"
                            )
                        }

                        override fun onAdOpened() {
                            Log.d(TAG, "Banner opened")
                        }

                        override fun onAdClosed() {
                            Log.d(TAG, "Banner closed")
                        }
                    }
                    loadAd(AdRequest.Builder().build())
                }
            }
        )
    }
}
