import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { AdMob, BannerAdPluginEvents } from "@capacitor-community/admob";
import { showBanner, hideBanner } from "../lib/admob";

interface AdBannerProps {
  className?: string;
  slotId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = "", slotId = "default-slot" }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // If running in browser or web preview, AdMob is not active -> keep hidden
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

      showBanner();
    } catch (_) {
      setAdLoaded(false);
    }

    return () => {
      try {
        if (loadedListener && typeof loadedListener.remove === "function") loadedListener.remove();
        if (failedListener && typeof failedListener.remove === "function") failedListener.remove();
      } catch (_) {}
      hideBanner();
    };
  }, [slotId, isNative]);

  // If AdMob is not active or no ad has loaded, render nothing (no blank/empty space)
  if (!adLoaded) {
    return null;
  }

  // When AdMob banner is active and loaded, render minimal reserved banner frame
  return (
    <div
      className={`w-full overflow-hidden my-2 flex justify-center items-center ${className}`}
      id={`ad-slot-${slotId}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-[320px] sm:max-w-[468px] h-[50px] sm:h-[60px] bg-transparent" />
    </div>
  );
};
