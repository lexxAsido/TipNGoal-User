import { Platform } from "react-native";

import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";

// Ad Unit IDs
const adUnitIds = {
  banner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-3940256099942544/6300978111",
  }),
  interstitial: Platform.select({
    ios: "ca-app-pub-3940256099942544/4411468910",
    android: "ca-app-pub-3940256099942544/1033173712",
  }),
  rewarded: Platform.select({
    ios: "ca-app-pub-3940256099942544/1712485313",
    android: "ca-app-pub-3940256099942544/5224354917",
  }),
};

// Load and Show Interstitial Ads
export const showInterstitialAd = async () => {
  try {
    await AdMobInterstitial.setAdUnitID(adUnitIds.interstitial);
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  } catch (error) {
    console.error("Interstitial Ad Error:", error);
  }
};

// Load and Show Rewarded Ads
export const showRewardedAd = async () => {
  try {
    await AdMobRewarded.setAdUnitID(adUnitIds.rewarded);
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
  } catch (error) {
    console.error("Rewarded Ad Error:", error);
  }
};

// Banner Ad Component
export const BannerAd = () => (
  <AdMobBanner
    bannerSize="banner"
    adUnitID={adUnitIds.banner}
    servePersonalizedAds
    onDidFailToReceiveAdWithError={(error) => console.error("Banner Ad Error:", error)}
  />
);
