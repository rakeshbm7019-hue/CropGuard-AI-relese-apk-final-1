import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdOptions,
  RewardAdPluginEvents,
  AdOptions,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Exact configured Real Google AdMob IDs for CropGuard AI
export const ADMOB_APP_ID = 'ca-app-pub-6652067022010690~4420290370';
export const BANNER_ID = 'ca-app-pub-6652067022010690/7039101892';
export const INTERSTITIAL_ID = 'ca-app-pub-6652067022010690/3622601065';
export const REWARDED_ID = 'ca-app-pub-6652067022010690/1690185253';
export const NATIVE_ID = 'ca-app-pub-6652067022010690/2261030890';
export const APP_OPEN_ID = 'ca-app-pub-6652067022010690/8170641152';

// Lifecycle & tracking state
let isInitialized = false;
let isBannerVisible = false;
let isBannerLoading = false;
let isInterstitialPreparing = false;
let isInterstitialReady = false;
let lastInterstitialShownTimestamp = 0;
let consecutiveScanCount = 0;

// Frequency capping configuration (reasonable, farmer-friendly limits)
const MIN_INTERSTITIAL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
const MIN_SCANS_BETWEEN_INTERSTITIALS = 2; // Every 2nd completed scan

/**
 * Initializes Google Mobile Ads SDK for native Android with detailed error logging.
 */
export async function initializeAdMob(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[AdMob] Running on web platform - AdMob native ads inactive.');
    return false;
  }

  if (isInitialized) {
    return true;
  }

  try {
    // Register detailed diagnostic event listeners
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Banner Ad Loaded Successfully (ID: ' + BANNER_ID + ')');
      isBannerVisible = true;
      isBannerLoading = false;
    });

    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err: any) => {
      const errCode = err?.code || err?.errorCode || 'UNKNOWN';
      const errMsg = err?.message || err?.localizedMessage || JSON.stringify(err);
      console.error(`[AdMob ERROR] Banner Ad Failed to Load! Code: ${errCode} | Message: ${errMsg} | ID: ${BANNER_ID}`);
      isBannerVisible = false;
      isBannerLoading = false;
    });

    AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log('[AdMob] Banner Ad Clicked / Opened');
    });

    AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log('[AdMob] Banner Ad Closed');
    });

    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Interstitial Ad Prepared & Loaded Successfully (ID: ' + INTERSTITIAL_ID + ')');
      isInterstitialReady = true;
      isInterstitialPreparing = false;
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err: any) => {
      const errCode = err?.code || err?.errorCode || 'UNKNOWN';
      const errMsg = err?.message || err?.localizedMessage || JSON.stringify(err);
      console.error(`[AdMob ERROR] Interstitial Ad Failed to Load! Code: ${errCode} | Message: ${errMsg} | ID: ${INTERSTITIAL_ID}`);
      isInterstitialReady = false;
      isInterstitialPreparing = false;
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('[AdMob] Interstitial Ad Dismissed by User');
      isInterstitialReady = false;
      lastInterstitialShownTimestamp = Date.now();
      prepareInterstitialSilent();
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err: any) => {
      const errCode = err?.code || err?.errorCode || 'UNKNOWN';
      const errMsg = err?.message || err?.localizedMessage || JSON.stringify(err);
      console.error(`[AdMob ERROR] Interstitial Ad Failed to Show! Code: ${errCode} | Message: ${errMsg}`);
      isInterstitialReady = false;
    });

    // Initialize the SDK with production settings
    console.log('[AdMob] Calling AdMob.initialize with App ID: ' + ADMOB_APP_ID);
    await AdMob.initialize({
      testingDevices: [],
      initializeForTesting: false,
    });

    isInitialized = true;
    console.log('[AdMob] Google Mobile Ads SDK initialized successfully from JS Bridge.');

    prepareInterstitialSilent();

    return true;
  } catch (error: any) {
    console.error('[AdMob CRITICAL] Initialization exception:', error?.message || error, error);
    return false;
  }
}

/**
 * Shows the persistent bottom banner ad on the dashboard.
 */
export async function showBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  if (isBannerVisible || isBannerLoading) {
    return;
  }

  isBannerLoading = true;

  const options: BannerAdOptions = {
    adId: BANNER_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: false,
  };

  try {
    if (!isInitialized) {
      await initializeAdMob();
    }
    console.log('[AdMob] Requesting bottom banner ad for ID: ' + BANNER_ID);
    await AdMob.showBanner(options);
    isBannerVisible = true;
    isBannerLoading = false;
  } catch (error: any) {
    console.error('[AdMob ERROR] Show banner exception:', error?.message || error);
    isBannerVisible = false;
    isBannerLoading = false;
  }
}

/**
 * Hides and removes the banner ad.
 */
export async function hideBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.hideBanner();
    isBannerVisible = false;
  } catch (error: any) {
    console.warn('[AdMob] Hide banner notice:', error?.message || error);
  }
}

/**
 * Preloads an interstitial ad silently in the background.
 */
async function prepareInterstitialSilent(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (isInterstitialReady || isInterstitialPreparing) return;

  isInterstitialPreparing = true;

  const options: AdOptions = {
    adId: INTERSTITIAL_ID,
    isTesting: false,
  };

  try {
    console.log('[AdMob] Preparing silent interstitial ad for ID: ' + INTERSTITIAL_ID);
    await AdMob.prepareInterstitial(options);
    isInterstitialReady = true;
    isInterstitialPreparing = false;
  } catch (error: any) {
    console.error('[AdMob ERROR] Silent prepare interstitial exception:', error?.message || error);
    isInterstitialReady = false;
    isInterstitialPreparing = false;
  }
}

/**
 * Displays an interstitial ad after a successful crop disease scan with frequency capping.
 */
export async function showInterstitialAfterScan(force: boolean = false): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  consecutiveScanCount++;
  const now = Date.now();
  const timeSinceLastAd = now - lastInterstitialShownTimestamp;

  if (!force) {
    if (consecutiveScanCount < MIN_SCANS_BETWEEN_INTERSTITIALS && lastInterstitialShownTimestamp !== 0) {
      console.log(`[AdMob] Interstitial skipped: scan count (${consecutiveScanCount}/${MIN_SCANS_BETWEEN_INTERSTITIALS})`);
      prepareInterstitialSilent();
      return false;
    }

    if (timeSinceLastAd < MIN_INTERSTITIAL_INTERVAL_MS && lastInterstitialShownTimestamp !== 0) {
      const waitRemainingSec = Math.round((MIN_INTERSTITIAL_INTERVAL_MS - timeSinceLastAd) / 1000);
      console.log(`[AdMob] Interstitial skipped: cooldown active (${waitRemainingSec}s remaining)`);
      prepareInterstitialSilent();
      return false;
    }
  }

  const options: AdOptions = {
    adId: INTERSTITIAL_ID,
    isTesting: false,
  };

  try {
    if (!isInitialized) {
      await initializeAdMob();
    }

    if (!isInterstitialReady) {
      console.log('[AdMob] Interstitial not pre-warmed, preparing now...');
      await AdMob.prepareInterstitial(options);
      isInterstitialReady = true;
    }

    console.log('[AdMob] Showing interstitial ad...');
    await AdMob.showInterstitial();
    lastInterstitialShownTimestamp = Date.now();
    consecutiveScanCount = 0;
    isInterstitialReady = false;
    console.log('[AdMob] Interstitial successfully displayed.');
    return true;
  } catch (error: any) {
    console.error('[AdMob ERROR] Show interstitial exception:', error?.message || error);
    isInterstitialReady = false;
    prepareInterstitialSilent();
    return false;
  }
}

export async function showInterstitial(): Promise<void> {
  await showInterstitialAfterScan(false);
}

/**
 * Rewarded ad integration.
 */
export async function showRewardedAd(onReward: () => void): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    onReward();
    return;
  }

  const options: RewardAdOptions = {
    adId: REWARDED_ID,
    isTesting: false,
  };

  try {
    if (!isInitialized) {
      await initializeAdMob();
    }

    await AdMob.prepareRewardVideoAd(options);

    const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
      console.log('[AdMob] User rewarded:', reward);
      onReward();
      rewardListener.remove();
    });

    await AdMob.showRewardVideoAd();
  } catch (error: any) {
    console.error('[AdMob ERROR] Rewarded ad exception:', error?.message || error);
  }
}

/**
 * App Open Ad on cold launch.
 */
export async function showAppOpenAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const options: AdOptions = {
    adId: APP_OPEN_ID,
    isTesting: false,
  };

  try {
    if (!isInitialized) {
      await initializeAdMob();
    }
    // @ts-ignore
    if (typeof AdMob.showAppOpenAd === 'function') {
      // @ts-ignore
      await AdMob.showAppOpenAd(options);
    }
  } catch (error: any) {
    console.warn('[AdMob] App open ad notice:', error?.message || error);
  }
}

export function getAdMobStatus() {
  return {
    isNative: Capacitor.isNativePlatform(),
    isInitialized,
    isBannerVisible,
    isInterstitialReady,
    lastInterstitialShownTimestamp,
    consecutiveScanCount,
    adMobAppId: ADMOB_APP_ID,
    bannerId: BANNER_ID,
    interstitialId: INTERSTITIAL_ID,
  };
}
