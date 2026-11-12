import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { AdMob, BannerAdPluginEvents } from "@capacitor-community/admob";
import { showBanner, hideBanner } from "../lib/admob";

interface AdBannerProps {
  className?: string;
  slotId?: string;
  autoShow?: boolean;
}

/**
 * AdBanner Component:
 * - On Native Android (Capacitor), requests the bottom adaptive banner using real AdMob IDs.
 * - On Web preview, stays cleanly hidden without rendering broken or blank blocks.
 * - Manages plugin lifecycle events (Loaded, FailedToLoad).
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  className = "",
  slotId = "default-slot",
  autoShow = true,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) {
      setAdLoaded(false);
      return;
    }

    let loadedListener: any;
    let failedListener: any;

    try {
      loadedListener = AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        setAdLoaded(true);
      });

      failedListener = AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
        setAdLoaded(false);
      });

      if (autoShow) {
        showBanner();
      }
    } catch (_) {
      setAdLoaded(false);
    }

    return () => {
      try {
        if (loadedListener && typeof loadedListener.remove === "function") loadedListener.remove();
        if (failedListener && typeof failedListener.remove === "function") failedListener.remove();
      } catch (_) {}
    };
  }, [slotId, isNative, autoShow]);

  // If not native or ad not loaded, do not leave empty gap
  if (!isNative || !adLoaded) {
    return null;
  }

  // Reserves space so content does not get hidden behind native overlay banner
  return (
    <div
      className={`w-full overflow-hidden my-2 flex justify-center items-center select-none pointer-events-none ${className}`}
      id={`ad-slot-${slotId}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-[320px] sm:max-w-[468px] h-[50px] sm:h-[60px] bg-transparent" />
    </div>
  );
};
