import type {CapacitorConfig} from "@capacitor/cli";
import {KeyboardResize, KeyboardStyle} from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "app.aidchat.com",
  appName: "aidchat",
  webDir: "build",
  server: {
    hostname: "app.aidchat.com",
    allowNavigation: [],
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
