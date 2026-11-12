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
// Show at most once every 3 minutes AND at least every 2 scans
const MIN_INTERSTITIAL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
const MIN_SCANS_BETWEEN_INTERSTITIALS = 2; // Every 2nd completed scan

/**
 * Initializes Google Mobile Ads SDK for native Android.
 */
export async function initializeAdMob(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  if (isInitialized) {
    return true;
  }

  try {
    // Register global event listeners for diagnostic logs & state tracking
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Banner Ad Loaded');
      isBannerVisible = true;
      isBannerLoading = false;
    });

    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err: any) => {
      console.warn('[AdMob] Banner Ad Failed to Load:', err);
      isBannerVisible = false;
      isBannerLoading = false;
    });

    AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log('[AdMob] Banner Ad Opened');
    });

    AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log('[AdMob] Banner Ad Closed');
    });

    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Interstitial Ad Prepared & Loaded');
      isInterstitialReady = true;
      isInterstitialPreparing = false;
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err: any) => {
      console.warn('[AdMob] Interstitial Ad Failed to Load:', err);
      isInterstitialReady = false;
      isInterstitialPreparing = false;
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('[AdMob] Interstitial Ad Dismissed by User');
      isInterstitialReady = false;
      lastInterstitialShownTimestamp = Date.now();
      // Pre-warm the next interstitial in the background
      prepareInterstitialSilent();
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err: any) => {
      console.warn('[AdMob] Interstitial Ad Failed to Show:', err);
      isInterstitialReady = false;
    });

    // Initialize the SDK with production settings (no test devices, real ads)
    await AdMob.initialize({
      testingDevices: [],
      initializeForTesting: false,
    });

    isInitialized = true;
    console.log('[AdMob] Google Mobile Ads SDK initialized successfully');

    // Preload first interstitial ad quietly in background
    prepareInterstitialSilent();

    return true;
  } catch (error) {
    console.error('[AdMob] Initialization error:', error);
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
    await AdMob.showBanner(options);
    isBannerVisible = true;
    isBannerLoading = false;
  } catch (error) {
    console.warn('[AdMob] Show banner error:', error);
    isBannerVisible = false;
    isBannerLoading = false;
  }
}

/**
 * Hides and removes the banner ad if needed.
 */
export async function hideBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.hideBanner();
    isBannerVisible = false;
  } catch (error) {
    console.warn('[AdMob] Hide banner error:', error);
  }
}

/**
 * Preloads an interstitial ad silently in the background so it displays instantly when triggered.
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
    await AdMob.prepareInterstitial(options);
    isInterstitialReady = true;
    isInterstitialPreparing = false;
  } catch (error) {
    console.warn('[AdMob] Silent prepare interstitial error:', error);
    isInterstitialReady = false;
    isInterstitialPreparing = false;
  }
}

/**
 * Displays an interstitial ad after a successful crop disease scan,
 * respecting reasonable frequency limits to prevent annoying the farmer.
 *
 * Frequency rules:
 * - Minimum 2 completed scans between ads
 * - Minimum 3 minutes cooldown between interstitial presentations
 */
export async function showInterstitialAfterScan(force: boolean = false): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  consecutiveScanCount++;
  const now = Date.now();
  const timeSinceLastAd = now - lastInterstitialShownTimestamp;

  if (!force) {
    // Check frequency constraints
    if (consecutiveScanCount < MIN_SCANS_BETWEEN_INTERSTITIALS && lastInterstitialShownTimestamp !== 0) {
      console.log(`[AdMob] Interstitial skipped: scan count (${consecutiveScanCount}/${MIN_SCANS_BETWEEN_INTERSTITIALS})`);
      // Make sure the next ad is pre-warmed
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

    // If not already prepared, prepare now with a timeout fallback
    if (!isInterstitialReady) {
      console.log('[AdMob] Interstitial not pre-warmed, preparing now...');
      await AdMob.prepareInterstitial(options);
      isInterstitialReady = true;
    }

    await AdMob.showInterstitial();
    lastInterstitialShownTimestamp = Date.now();
    consecutiveScanCount = 0;
    isInterstitialReady = false;
    console.log('[AdMob] Interstitial successfully displayed to user');
    return true;
  } catch (error) {
    console.warn('[AdMob] Show interstitial notice:', error);
    isInterstitialReady = false;
    // Attempt background reload for next opportunity
    prepareInterstitialSilent();
    return false;
  }
}

/**
 * Legacy wrapper for showInterstitial with frequency protection.
 */
export async function showInterstitial(): Promise<void> {
  await showInterstitialAfterScan(false);
}

/**
 * Rewarded ad integration for bonus feature unlocks.
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
  } catch (error) {
    console.warn('[AdMob] Error showing rewarded ad:', error);
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
    // @ts-ignore - AppOpen may exist depending on platform plugin build
    if (typeof AdMob.showAppOpenAd === 'function') {
      // @ts-ignore
      await AdMob.showAppOpenAd(options);
    }
  } catch (error) {
    console.warn('[AdMob] App open ad notice:', error);
  }
}

/**
 * Returns current AdMob configuration status for diagnostic checks.
 */
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
