import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdOptions,
  RewardAdPluginEvents,
  AppOpenAdPluginEvents,
  AdOptions,
  AdMobError,
  AdMobRewardItem,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Exact configured Real Google AdMob IDs for CropGuard AI
export const ADMOB_APP_ID = 'ca-app-pub-6652067022010690~4420290370';
export const BANNER_ID = 'ca-app-pub-6652067022010690/7039101892';
export const INTERSTITIAL_ID = 'ca-app-pub-6652067022010690/3622601065';
export const REWARDED_ID = 'ca-app-pub-6652067022010690/1690185253';
export const NATIVE_ID = 'ca-app-pub-6652067022010690/2261030890';
export const APP_OPEN_ID = 'ca-app-pub-6652067022010690/8170641152';

export interface BannerState {
  visible: boolean;
  loaded: boolean;
  loading: boolean;
  height: number;
  width: number;
  lastError: string | null;
}

export interface RewardedAdResult {
  rewarded: boolean;
  dismissed?: boolean;
  error?: string;
}

export interface RewardedAdCallbacks {
  onLoaded?: () => void;
  onFailedToLoad?: (errorMsg: string) => void;
  onDismissedWithoutReward?: () => void;
  onFailedToShow?: (errorMsg: string) => void;
}

// Singleton Lifecycle & Tracking State
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;
let listenersRegistered = false;

// Banner State
let isBannerCreated = false;
let isBannerHidden = false;
let lastBannerFailedAt = 0;
let bannerState: BannerState = {
  visible: false,
  loaded: false,
  loading: false,
  height: 0,
  width: 0,
  lastError: null,
};
const bannerSubscribers = new Set<(state: BannerState) => void>();

// Interstitial State
let isInterstitialPreparing = false;
let isInterstitialReady = false;
let isInterstitialShowing = false;
let interstitialPreparePromise: Promise<boolean> | null = null;
let lastInterstitialShownTimestamp = 0;
let consecutiveScanCount = 0;

// Rewarded State
let isRewardedPreparing = false;
let isRewardedReady = false;
let isRewardedShowing = false;
let rewardedPreparePromise: Promise<boolean> | null = null;
let lastRewardedError: string | null = null;
let activeRewardSession: {
  earned: boolean;
  onReward: () => void;
  callbacks?: RewardedAdCallbacks;
  resolve: (result: RewardedAdResult) => void;
  settled: boolean;
} | null = null;

// App Open State
let appOpenAttempted = false;
let isAppOpenLoaded = false;

// Reasonable, farmer-friendly frequency limits
const MIN_INTERSTITIAL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
const MIN_SCANS_BETWEEN_INTERSTITIALS = 2; // Every 2nd completed scan after initial
const BANNER_RETRY_COOLDOWN_MS = 5 * 1000; // 5s cooldown after banner load error

function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine !== false;
}

function formatAdMobError(err: any): { code: string | number; message: string } {
  const code = err?.code ?? err?.errorCode ?? 'UNKNOWN';
  const message =
    err?.message ||
    err?.localizedMessage ||
    (typeof err === 'string' ? err : JSON.stringify(err || 'Unknown AdMob error'));
  return { code, message };
}

function updateBannerState(patch: Partial<BannerState>): void {
  bannerState = { ...bannerState, ...patch };
  const snapshot = { ...bannerState };
  bannerSubscribers.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (_) {}
  });
}

export function getBannerState(): BannerState {
  return { ...bannerState };
}

export function subscribeBannerState(listener: (state: BannerState) => void): () => void {
  bannerSubscribers.add(listener);
  listener({ ...bannerState });
  return () => {
    bannerSubscribers.delete(listener);
  };
}

function settleActiveRewardSession(result: RewardedAdResult): void {
  const session = activeRewardSession;
  if (!session || session.settled) return;
  session.settled = true;
  activeRewardSession = null;
  isRewardedShowing = false;
  isRewardedReady = false;
  session.resolve(result);
  // Silently pre-warm next rewarded ad in background
  prepareRewardedAdSilent().catch(() => {});
}

async function registerGlobalListeners(): Promise<void> {
  if (listenersRegistered || !Capacitor.isNativePlatform()) return;
  listenersRegistered = true;

  try {
    // 1. BANNER EVENTS
    await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log(`[AdMob] Banner Ad Loaded Successfully (ID: ${BANNER_ID})`);
      isBannerCreated = true;
      isBannerHidden = false;
      updateBannerState({
        visible: true,
        loaded: true,
        loading: false,
        lastError: null,
      });
    });

    await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (info) => {
      const height = Number(info?.height || 0);
      const width = Number(info?.width || 0);
      updateBannerState({
        height,
        width,
        visible: height > 0,
      });
    });

    await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.error(
        `[AdMob ERROR] Banner Ad Failed to Load! Code: ${code} | Message: ${message} | ID: ${BANNER_ID}`
      );
      isBannerCreated = false;
      isBannerHidden = false;
      lastBannerFailedAt = Date.now();
      updateBannerState({
        visible: false,
        loaded: false,
        loading: false,
        height: 0,
        width: 0,
        lastError: `Code ${code}: ${message}`,
      });
    });

    await AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log('[AdMob] Banner Ad Opened');
    });

    await AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log('[AdMob] Banner Ad Closed');
    });

    await AdMob.addListener(BannerAdPluginEvents.AdImpression, () => {
      console.log('[AdMob] Banner Ad Impression Recorded');
    });

    // 2. INTERSTITIAL EVENTS
    await AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
      console.log(`[AdMob] Interstitial Loaded (ID: ${info?.adUnitId || INTERSTITIAL_ID})`);
      isInterstitialReady = true;
      isInterstitialPreparing = false;
    });

    await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.error(
        `[AdMob ERROR] Interstitial Failed to Load! Code: ${code} | Message: ${message} | ID: ${INTERSTITIAL_ID}`
      );
      isInterstitialReady = false;
      isInterstitialPreparing = false;
    });

    await AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
      console.log('[AdMob] Interstitial Ad Showed');
      isInterstitialShowing = true;
    });

    await AdMob.addListener(InterstitialAdPluginEvents.AdImpression, () => {
      console.log('[AdMob] Interstitial Impression Recorded');
    });

    await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('[AdMob] Interstitial Dismissed by User');
      isInterstitialReady = false;
      isInterstitialShowing = false;
      lastInterstitialShownTimestamp = Date.now();
      prepareInterstitialSilent().catch(() => {});
    });

    await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.error(`[AdMob ERROR] Interstitial Failed to Show! Code: ${code} | Message: ${message}`);
      isInterstitialReady = false;
      isInterstitialShowing = false;
      prepareInterstitialSilent().catch(() => {});
    });

    // 3. REWARDED AD EVENTS
    await AdMob.addListener(RewardAdPluginEvents.Loaded, (info) => {
      console.log(`[AdMob] Rewarded Ad Loaded (ID: ${info?.adUnitId || REWARDED_ID})`);
      isRewardedReady = true;
      isRewardedPreparing = false;
      lastRewardedError = null;
      activeRewardSession?.callbacks?.onLoaded?.();
    });

    await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.error(
        `[AdMob ERROR] Rewarded Ad Failed to Load! Code: ${code} | Message: ${message} | ID: ${REWARDED_ID}`
      );
      isRewardedReady = false;
      isRewardedPreparing = false;
      lastRewardedError = `Code ${code}: ${message}`;
      activeRewardSession?.callbacks?.onFailedToLoad?.(lastRewardedError);
    });

    await AdMob.addListener(RewardAdPluginEvents.Showed, () => {
      console.log('[AdMob] Rewarded Ad Showed');
      isRewardedShowing = true;
    });

    await AdMob.addListener(RewardAdPluginEvents.AdImpression, () => {
      console.log('[AdMob] Rewarded Ad Impression Recorded');
    });

    await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      console.log('[AdMob] User Earned Reward:', reward);
      if (activeRewardSession && !activeRewardSession.earned) {
        activeRewardSession.earned = true;
        try {
          activeRewardSession.onReward();
        } catch (cbErr) {
          console.error('[AdMob] onReward callback error:', cbErr);
        }
        // Resolve right away so UI unlocks immediately without waiting for dismiss
        settleActiveRewardSession({ rewarded: true });
      }
    });

    await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('[AdMob] Rewarded Ad Dismissed');
      if (activeRewardSession && !activeRewardSession.settled) {
        if (activeRewardSession.earned) {
          settleActiveRewardSession({ rewarded: true });
        } else {
          activeRewardSession.callbacks?.onDismissedWithoutReward?.();
          settleActiveRewardSession({ rewarded: false, dismissed: true });
        }
      } else {
        isRewardedShowing = false;
        isRewardedReady = false;
        prepareRewardedAdSilent().catch(() => {});
      }
    });

    await AdMob.addListener(RewardAdPluginEvents.FailedToShow, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      const errMsg = `Code ${code}: ${message}`;
      console.error(`[AdMob ERROR] Rewarded Ad Failed to Show! ${errMsg}`);
      if (activeRewardSession && !activeRewardSession.settled) {
        activeRewardSession.callbacks?.onFailedToShow?.(errMsg);
        settleActiveRewardSession({ rewarded: false, error: errMsg });
      } else {
        isRewardedShowing = false;
        isRewardedReady = false;
      }
    });

    // 4. APP OPEN AD EVENTS
    await AdMob.addListener(AppOpenAdPluginEvents.Loaded, (info) => {
      console.log(`[AdMob] App Open Ad Loaded (ID: ${info?.adUnitId || APP_OPEN_ID})`);
      isAppOpenLoaded = true;
    });

    await AdMob.addListener(AppOpenAdPluginEvents.FailedToLoad, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.warn(
        `[AdMob] App Open Ad Failed to Load: Code ${code} | ${message} (ID: ${APP_OPEN_ID})`
      );
      isAppOpenLoaded = false;
    });

    await AdMob.addListener(AppOpenAdPluginEvents.Opened, () => {
      console.log('[AdMob] App Open Ad Opened');
    });

    await AdMob.addListener(AppOpenAdPluginEvents.Closed, () => {
      console.log('[AdMob] App Open Ad Closed');
      isAppOpenLoaded = false;
    });

    await AdMob.addListener(AppOpenAdPluginEvents.FailedToShow, (err: AdMobError) => {
      const { code, message } = formatAdMobError(err);
      console.warn(`[AdMob] App Open Ad Failed to Show: Code ${code} | ${message}`);
      isAppOpenLoaded = false;
    });
  } catch (err) {
    listenersRegistered = false;
    console.error('[AdMob ERROR] Failed registering global listeners:', err);
  }
}

/**
 * Initializes Google Mobile Ads SDK once on native Android with production config.
 * Deduplicates concurrent calls via a shared promise.
 */
export async function initializeAdMob(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[AdMob] Running on web platform - AdMob native ads inactive.');
    return false;
  }

  if (isInitialized) {
    return true;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await registerGlobalListeners();

      console.log(`[AdMob] Calling AdMob.initialize with App ID: ${ADMOB_APP_ID}`);
      await AdMob.initialize({
        testingDevices: [],
        initializeForTesting: false,
      });

      isInitialized = true;
      console.log('[AdMob] Google Mobile Ads SDK initialized successfully via JS Bridge.');

      // Pre-warm interstitial in background if online
      if (isOnline()) {
        prepareInterstitialSilent().catch(() => {});
      }

      return true;
    } catch (error: any) {
      const { code, message } = formatAdMobError(error);
      console.error(`[AdMob CRITICAL] Initialization exception: Code ${code} | ${message}`, error);
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
}

/**
 * Shows or resumes the persistent bottom adaptive banner ad.
 * Prevents duplicate banner requests.
 */
export async function showBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  if (bannerState.loading) {
    return;
  }

  // If already created and currently hidden, resume without creating a duplicate AdView/request
  if (isBannerCreated && isBannerHidden) {
    try {
      await AdMob.resumeBanner();
      isBannerHidden = false;
      updateBannerState({ visible: true, loaded: true });
    } catch (error: any) {
      const { code, message } = formatAdMobError(error);
      console.warn(`[AdMob] resumeBanner notice: Code ${code} | ${message}`);
    }
    return;
  }

  // Already created & visible
  if (isBannerCreated && bannerState.visible) {
    return;
  }

  if (!isOnline()) {
    return;
  }

  if (Date.now() - lastBannerFailedAt < BANNER_RETRY_COOLDOWN_MS) {
    return;
  }

  updateBannerState({ loading: true, lastError: null });

  const options: BannerAdOptions = {
    adId: BANNER_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: false,
  };

  try {
    const ok = await initializeAdMob();
    if (!ok) {
      updateBannerState({ loading: false });
      return;
    }

    console.log(`[AdMob] Requesting bottom adaptive banner for ID: ${BANNER_ID}`);
    await AdMob.showBanner(options);
    isBannerCreated = true;
    isBannerHidden = false;
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    console.error(`[AdMob ERROR] Show banner exception: Code ${code} | ${message}`);
    isBannerCreated = false;
    lastBannerFailedAt = Date.now();
    updateBannerState({
      visible: false,
      loaded: false,
      loading: false,
      height: 0,
      lastError: `Code ${code}: ${message}`,
    });
  }
}

/**
 * Hides the native banner view temporarily (e.g. on Admin or Auth screens).
 */
export async function hideBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (!isBannerCreated || isBannerHidden) return;

  try {
    await AdMob.hideBanner();
    isBannerHidden = true;
    updateBannerState({ visible: false });
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    console.warn(`[AdMob] Hide banner notice: Code ${code} | ${message}`);
  }
}

/**
 * Destroys the native banner view completely.
 */
export async function removeBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (!isBannerCreated) return;

  try {
    await AdMob.removeBanner();
    isBannerCreated = false;
    isBannerHidden = false;
    updateBannerState({ visible: false, loaded: false, loading: false, height: 0, width: 0 });
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    console.warn(`[AdMob] Remove banner notice: Code ${code} | ${message}`);
  }
}

/**
 * Preloads an interstitial ad silently in the background (deduplicated).
 */
export async function prepareInterstitialSilent(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (!isOnline()) return false;
  if (isInterstitialReady) return true;
  if (interstitialPreparePromise) return interstitialPreparePromise;

  isInterstitialPreparing = true;
  interstitialPreparePromise = (async () => {
    try {
      const ok = await initializeAdMob();
      if (!ok) {
        isInterstitialPreparing = false;
        return false;
      }

      const options: AdOptions = {
        adId: INTERSTITIAL_ID,
        isTesting: false,
      };

      console.log(`[AdMob] Preparing silent interstitial ad for ID: ${INTERSTITIAL_ID}`);
      await AdMob.prepareInterstitial(options);
      isInterstitialReady = true;
      isInterstitialPreparing = false;
      return true;
    } catch (error: any) {
      const { code, message } = formatAdMobError(error);
      console.error(
        `[AdMob ERROR] Silent prepare interstitial failed: Code ${code} | ${message}`
      );
      isInterstitialReady = false;
      isInterstitialPreparing = false;
      return false;
    } finally {
      interstitialPreparePromise = null;
    }
  })();

  return interstitialPreparePromise;
}

/**
 * Displays an interstitial ad after a successful crop disease scan with reasonable frequency limits.
 */
export async function showInterstitialAfterScan(force: boolean = false): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (!isOnline() || isInterstitialShowing) return false;

  consecutiveScanCount++;
  const now = Date.now();
  const timeSinceLastAd = now - lastInterstitialShownTimestamp;

  if (!force) {
    if (consecutiveScanCount < MIN_SCANS_BETWEEN_INTERSTITIALS && lastInterstitialShownTimestamp !== 0) {
      console.log(
        `[AdMob] Interstitial skipped: scan count (${consecutiveScanCount}/${MIN_SCANS_BETWEEN_INTERSTITIALS})`
      );
      prepareInterstitialSilent().catch(() => {});
      return false;
    }

    if (timeSinceLastAd < MIN_INTERSTITIAL_INTERVAL_MS && lastInterstitialShownTimestamp !== 0) {
      const waitRemainingSec = Math.round((MIN_INTERSTITIAL_INTERVAL_MS - timeSinceLastAd) / 1000);
      console.log(`[AdMob] Interstitial skipped: cooldown active (${waitRemainingSec}s remaining)`);
      prepareInterstitialSilent().catch(() => {});
      return false;
    }
  }

  try {
    const ok = await initializeAdMob();
    if (!ok) return false;

    if (!isInterstitialReady) {
      console.log('[AdMob] Interstitial not pre-warmed yet, attempting quick prepare...');
      const prepared = await Promise.race<boolean>([
        prepareInterstitialSilent(),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000)),
      ]);
      if (!prepared && !isInterstitialReady) {
        console.log('[AdMob] Interstitial still loading; will be ready for next scan.');
        return false;
      }
    }

    isInterstitialShowing = true;
    console.log(`[AdMob] Showing interstitial ad (ID: ${INTERSTITIAL_ID})...`);
    await AdMob.showInterstitial();
    lastInterstitialShownTimestamp = Date.now();
    consecutiveScanCount = 0;
    isInterstitialReady = false;
    return true;
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    console.error(`[AdMob ERROR] Show interstitial failed: Code ${code} | ${message}`);
    isInterstitialReady = false;
    isInterstitialShowing = false;
    prepareInterstitialSilent().catch(() => {});
    return false;
  }
}

export async function showInterstitial(): Promise<void> {
  await showInterstitialAfterScan(false);
}

/**
 * Preloads the voluntary rewarded video ad silently in the background (deduplicated).
 */
export async function prepareRewardedAdSilent(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (!isOnline()) return false;
  if (isRewardedReady) return true;
  if (rewardedPreparePromise) return rewardedPreparePromise;

  isRewardedPreparing = true;
  rewardedPreparePromise = (async () => {
    try {
      const ok = await initializeAdMob();
      if (!ok) {
        isRewardedPreparing = false;
        return false;
      }

      const options: RewardAdOptions = {
        adId: REWARDED_ID,
        isTesting: false,
      };

      console.log(`[AdMob] Preparing rewarded video ad (ID: ${REWARDED_ID})...`);
      await AdMob.prepareRewardVideoAd(options);
      isRewardedReady = true;
      isRewardedPreparing = false;
      lastRewardedError = null;
      return true;
    } catch (error: any) {
      const { code, message } = formatAdMobError(error);
      lastRewardedError = `Code ${code}: ${message}`;
      console.error(`[AdMob ERROR] Prepare rewarded ad failed: ${lastRewardedError}`);
      isRewardedReady = false;
      isRewardedPreparing = false;
      return false;
    } finally {
      rewardedPreparePromise = null;
    }
  })();

  return rewardedPreparePromise;
}

/**
 * Voluntary Rewarded Ad integration.
 * Only unlocks the reward when the user finishes watching (RewardAdPluginEvents.Rewarded),
 * and cleanly resolves without hanging if the user dismisses early or the ad fails to load/show.
 */
export async function showRewardedAd(
  onReward: () => void,
  callbacks?: RewardedAdCallbacks
): Promise<RewardedAdResult> {
  if (!Capacitor.isNativePlatform()) {
    onReward();
    return { rewarded: true };
  }

  if (isRewardedShowing || activeRewardSession) {
    return { rewarded: false, error: 'Rewarded ad is already in progress.' };
  }

  if (!isOnline()) {
    const msg = 'No internet connection. Please connect to load the rewarded video.';
    callbacks?.onFailedToLoad?.(msg);
    return { rewarded: false, error: msg };
  }

  try {
    const ok = await initializeAdMob();
    if (!ok) {
      const msg = 'AdMob SDK is not initialized yet.';
      callbacks?.onFailedToLoad?.(msg);
      return { rewarded: false, error: msg };
    }

    if (!isRewardedReady) {
      const prepared = await prepareRewardedAdSilent();
      if (!prepared && !isRewardedReady) {
        const msg = lastRewardedError || 'Rewarded video is not available right now. Please try again.';
        callbacks?.onFailedToLoad?.(msg);
        return { rewarded: false, error: msg };
      }
    }

    isRewardedShowing = true;

    return await new Promise<RewardedAdResult>((resolve) => {
      activeRewardSession = {
        earned: false,
        onReward,
        callbacks,
        resolve,
        settled: false,
      };

      // Note: On Capacitor AdMob Android, showRewardVideoAd() only resolves inside
      // OnUserEarnedRewardListener and NEVER resolves if the user closes early before reward.
      // Therefore Dismissed / FailedToShow listeners settle the promise cleanly.
      AdMob.showRewardVideoAd()
        .then((rewardItem) => {
          if (activeRewardSession && !activeRewardSession.earned && rewardItem) {
            activeRewardSession.earned = true;
            try {
              onReward();
            } catch (cbErr) {
              console.error('[AdMob] onReward callback error:', cbErr);
            }
          }
          settleActiveRewardSession({ rewarded: true });
        })
        .catch((err: any) => {
          const { code, message } = formatAdMobError(err);
          const errMsg = `Code ${code}: ${message}`;
          console.error(`[AdMob ERROR] showRewardVideoAd rejected: ${errMsg}`);
          callbacks?.onFailedToShow?.(errMsg);
          settleActiveRewardSession({ rewarded: false, error: errMsg });
        });
    });
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    const errMsg = `Code ${code}: ${message}`;
    console.error(`[AdMob ERROR] Rewarded ad exception: ${errMsg}`);
    isRewardedShowing = false;
    activeRewardSession = null;
    callbacks?.onFailedToShow?.(errMsg);
    return { rewarded: false, error: errMsg };
  }
}

/**
 * App Open Ad on cold launch using Capacitor AdMob 8 loadAppOpen + showAppOpen API.
 */
export async function showAppOpenAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (appOpenAttempted || !isOnline()) return;
  appOpenAttempted = true;

  try {
    const ok = await initializeAdMob();
    if (!ok) return;

    console.log(`[AdMob] Loading App Open Ad (ID: ${APP_OPEN_ID})...`);
    await AdMob.loadAppOpen({ adId: APP_OPEN_ID });
    isAppOpenLoaded = true;
    await AdMob.showAppOpen({ adId: APP_OPEN_ID });
    isAppOpenLoaded = false;
  } catch (error: any) {
    const { code, message } = formatAdMobError(error);
    console.warn(`[AdMob] App open ad notice: Code ${code} | ${message}`);
    isAppOpenLoaded = false;
  }
}

export function getAdMobStatus() {
  return {
    isNative: Capacitor.isNativePlatform(),
    isInitialized,
    bannerState: { ...bannerState },
    isInterstitialReady,
    isInterstitialPreparing,
    isInterstitialShowing,
    isRewardedReady,
    isRewardedPreparing,
    isRewardedShowing,
    isAppOpenLoaded,
    lastInterstitialShownTimestamp,
    consecutiveScanCount,
    adMobAppId: ADMOB_APP_ID,
    bannerId: BANNER_ID,
    interstitialId: INTERSTITIAL_ID,
    rewardedId: REWARDED_ID,
    nativeId: NATIVE_ID,
    appOpenId: APP_OPEN_ID,
  };
}
