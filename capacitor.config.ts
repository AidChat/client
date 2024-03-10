import type { CapacitorConfig } from '@capacitor/cli';
import {KeyboardResize, KeyboardStyle} from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: 'app.aidchat.com',
  appName: 'aidchat',
  webDir: 'build',
  server: {
    allowNavigation: []
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
