import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cropguard.ai',
  appName: 'CropGuard AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-6652067022010690~4420290370',
      initializeForTesting: false,
      testingDevices: []
    }
  }
};

export default config;
