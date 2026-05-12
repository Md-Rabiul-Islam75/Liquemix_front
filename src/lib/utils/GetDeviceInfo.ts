import Bowser from "bowser";

export function getDeviceInfo() {
  const browser = Bowser.getParser(window.navigator.userAgent);
  return {
    os: browser.getOSName(), // e.g., "iOS", "Android", "Windows"
    browser: browser.getBrowserName(), // e.g., "Chrome", "Safari"
    platform: browser.getPlatformType(), // "mobile", "tablet", "desktop", or "tv"
  };
}
