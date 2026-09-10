# Token Scanner Mobile (React Native & Expo)

A React Native & Expo mobile trading console and token scanner application for iOS and Android.

## Features

- **Real-Time DEX Scanner Telemetry**: Live status badge (Running / Stopped / Scheduled), IST timestamps, active node heartbeat.
- **Position Monitor**: Displays open positions with dynamic P&L calculation, peak price tracker, and trailing stop line.
- **Market Execution**: Manual or Auto Pilot modes with simulated swap transaction hashes and one-tap emergency market sell.
- **DEX Pair Detection**: Live alert feed of newly deployed liquidity pools with contract address clipboard copy.
- **Quick Configuration Cards**: Adjust trade amount (ETH), trailing stop percentage, and schedule on the fly.
- **Full Settings Suite**:
  - Graduated coin migration filter
  - Token age limit (minutes)
  - Maximum wallet exposure (%)
  - RPC polling interval (seconds)
  - Daily scheduled trading window (IST hours)
  - Telegram alert broadcast channels management

---

## Quick Start Guide

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (version 18 or 20+).
2. Install the **Expo Go** app on your physical mobile device:
   - [iOS App Store (Expo Go)](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play (Expo Go)](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation & Launch

1. Open your terminal and navigate to the mobile folder:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on your device or simulator:
   - **iOS / Android device**: Scan the QR code displayed in your terminal using the Camera app (iOS) or the Expo Go app (Android).
   - **iOS Simulator**: Press `i` in the terminal (macOS with Xcode required).
   - **Android Emulator**: Press `a` in the terminal (Android Studio required).
   - **Web Preview**: Press `w` to run in browser.

---

## Building Native Binaries (APK / IPA)

To build standalone production apps for distribution:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure your build profile:
   ```bash
   eas build:configure
   ```

4. Build for Android (APK / AAB):
   ```bash
   eas build --platform android --profile preview
   ```

5. Build for iOS (IPA):
   ```bash
   eas build --platform ios --profile preview
   ```

---

## Project Structure

```
mobile/
├── App.tsx                     # Root mobile container, state management & ticker loop
├── app.json                    # Expo project configuration (bundle ID, permissions)
├── package.json                # React Native & Expo dependencies
├── tsconfig.json               # TypeScript compiler options
├── babel.config.js             # Babel preset configuration
└── src/
    ├── types.ts                # TypeScript interfaces (Positions, Snapshots, Settings)
    ├── theme.ts                # Design tokens (colors, spacing, radii)
    ├── initialData.ts          # Default telemetry state and mock data
    ├── formatters.ts           # Number, ETH, USD, IST date formatting
    ├── components/
    │   ├── PositionCard.tsx    # Live PnL & market sell action component
    │   └── SegmentedControl.tsx# Auto vs Manual mode switcher
    └── screens/
        ├── TradingScreen.tsx   # Primary scanner dashboard & wallet controls
        └── SettingsScreen.tsx  # Strategy parameters & Telegram notifications
```
