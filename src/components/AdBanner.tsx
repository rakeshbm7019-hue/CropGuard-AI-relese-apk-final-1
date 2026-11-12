
import React, { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdPluginEvents
} from "@capacitor-community/admob";
import { showBanner } from "../lib/admob";

interface AdBannerProps {
  className?: string;
  slotId?: string;
  autoShow?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = "",
  slotId = "default-slot",
  autoShow = true,
}) => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative || !autoShow) return;

    let active = true;
    let loadedListener: any;
    let failedListener: any;

    const startBanner = async () => {
      try {
        // Register listeners before requesting the banner.
        loadedListener = await AdMob.addListener(
          BannerAdPluginEvents.Loaded,
          () => console.log("[CropGuard] Banner loaded")
        );

        failedListener = await AdMob.addListener(
          BannerAdPluginEvents.FailedToLoad,
          (error) => console.error(
            "[CropGuard] Banner failed:", error
          )
        );

        if (!active) return;

        await showBanner();

        console.log("[CropGuard] Banner request completed");
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
  }, [isNative, autoShow, slotId]);

  return null;
};
