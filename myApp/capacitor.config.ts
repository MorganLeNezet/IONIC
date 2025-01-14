import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosIsEncryption: false,
      iosKeychainPrefix: 'ionic-sqlite-app',
      androidIsEncryption: false
    }
  }
};

export default config;