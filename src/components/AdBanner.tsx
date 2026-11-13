import React, { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdPluginEvents
} from "@capacitor-community/admob";
import { showBanner, hideBanner } from "../lib/admob";

interface AdBannerProps {
  className?: string;
  slotId?: string;
  autoShow?: boolean;
  visible?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = "",
  slotId = "default-slot",
  autoShow = true,
  visible = true,
}) => {
  const isNative = Capacitor.isNativePlatform();
  const shouldShow = autoShow && visible;

  useEffect(() => {
    if (!isNative) return;

    if (!shouldShow) {
      hideBanner().catch(() => {});
      return;
    }

    let active = true;
    let loadedListener: any;
    let failedListener: any;

    const startBanner = async () => {
      try {
        loadedListener = await AdMob.addListener(
          BannerAdPluginEvents.Loaded,
          () => console.log("[CropGuard] Banner loaded")
        );

        failedListener = await AdMob.addListener(
          BannerAdPluginEvents.FailedToLoad,
          (error) => console.error("[CropGuard] Banner failed:", error)
        );

        if (!active) return;

        await showBanner();
      } catch (error) {
        console.error("[CropGuard] Banner startup failed:", error);
      }
    };

    void startBanner();

    return () => {
      active = false;
      void loadedListener?.remove();
      void failedListener?.remove();
    };
  }, [isNative, shouldShow, slotId]);

  if (!isNative || !shouldShow) {
    return null;
  }

  return (
    <div
      className={`w-full overflow-hidden my-2 flex justify-center items-center select-none pointer-events-none ${className}`}
      id={`ad-slot-${slotId}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-[360px] sm:max-w-[468px] h-[56px] sm:h-[64px] bg-transparent" />
    </div>
  );
};
