# AXYS Mobile App

A fintech mobile application built with React Native and Expo. This app handles user onboarding, authentication, and secure access using biometric verification.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screens and Navigation Flow](#screens-and-navigation-flow)
- [Component Documentation](#component-documentation)
- [State Management](#state-management)
- [Internationalization](#internationalization)
- [Security Implementation](#security-implementation)
- [Known Limitations](#known-limitations)
- [Getting Started](#getting-started)
- [Building the APK](#building-the-apk)

---

## Overview

AXYS is a mobile banking/fintech application that focuses on secure user authentication. The app supports three main flows:

1. **Sign Up Flow** - New users create an account with email/phone verification, personal details, and security setup
2. **Login Flow** - Existing users authenticate with credentials and biometric/PIN verification
3. **Resume Flow** - Returning users who already have an account can quickly authenticate with biometrics or PIN

The entire app uses a dark theme with white/gray color palette, following modern fintech design patterns.

---

## Features

- Email and phone number registration with OTP verification
- Personal information collection (name, date of birth, nationality)
- PEP (Politically Exposed Person) declaration
- Address information collection
- Password creation with real-time validation
- 4-digit PIN code setup
- Biometric authentication (Face ID and Fingerprint)
- Multi-language support (English and Japanese)
- Secure storage for sensitive data
- Session management for returning users

---

## Tech Stack

### Core Framework
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `expo` | ~55.0.6 | Expo makes React Native development much easier. I don't have to deal with native build configurations manually, and it provides a lot of useful APIs out of the box. The managed workflow saves a ton of time. |
| `react` | 19.2.0 | The latest React version with improved performance and concurrent features. |
| `react-native` | 0.83.2 | The foundation for building native mobile apps with React. |
| `typescript` | ~5.9.2 | Type safety is essential for catching bugs early. Without TypeScript, managing a codebase this size would be a nightmare. |

### Navigation
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `@react-navigation/native` | ^7.1.33 | The standard navigation library for React Native. It handles screen transitions, deep linking, and navigation state really well. |
| `@react-navigation/native-stack` | ^7.14.5 | Native stack navigator gives better performance than the JS-based stack. The animations feel smoother and more native. |
| `react-native-screens` | ^4.24.0 | Required by React Navigation. It uses native navigation primitives which improves memory usage and performance. |
| `react-native-gesture-handler` | ^2.30.0 | Handles touch gestures. React Navigation needs this for swipe-back gestures and other touch interactions. |
| `react-native-safe-area-context` | ^5.7.0 | Handles safe area insets for notches, status bars, and home indicators. Without this, UI would overlap with system UI on modern phones. |

### Security & Storage
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `expo-local-authentication` | ^55.0.8 | Provides Face ID and Fingerprint authentication. This is the core of the biometric login feature. It handles all the native biometric APIs. |
| `expo-secure-store` | ^55.0.8 | Stores sensitive data like auth tokens and PIN codes. Unlike AsyncStorage, this encrypts data using the device's keychain (iOS) or keystore (Android). |

### UI & Styling
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `@expo-google-fonts/inter` | ^0.4.2 | Inter is a clean, modern font that works well for fintech apps. Google Fonts integration with Expo is seamless. |
| `expo-font` | ^55.0.4 | Required to load custom fonts in Expo. |
| `expo-linear-gradient` | ^55.0.8 | Used for gradient backgrounds if needed. |
| `react-native-svg` | ^15.15.3 | Renders SVG icons and graphics. The biometric icons (Face ID, Fingerprint) are SVG components. |
| `expo-splash-screen` | ^55.0.10 | Controls the splash screen visibility. I keep it visible until fonts are loaded to prevent layout jumps. |
| `expo-status-bar` | ~55.0.4 | Controls status bar appearance. Set to light content for the dark theme. |

### Internationalization
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `i18next` | ^25.8.18 | Industry standard i18n library. It's flexible and supports pluralization, interpolation, and nested translations. |
| `react-i18next` | ^16.5.8 | React bindings for i18next. The useTranslation hook makes it easy to access translations in components. |

### Date Handling
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `@react-native-community/datetimepicker` | ^8.6.0 | Native date picker for selecting date of birth. It uses the native iOS/Android date pickers which users are familiar with. |

### Backend (Prepared but not fully integrated)
| Package | Version | Why I Used It |
|---------|---------|---------------|
| `@supabase/supabase-js` | ^2.99.1 | Supabase client for future backend integration. Currently, the app uses mock data, but the infrastructure is ready for real API calls. |

---

## Project Structure

```
AxysApp/
├── App.tsx                     # App entry point, sets up providers and font loading
├── index.ts                    # Expo entry point
├── app.json                    # Expo configuration (app name, icons, permissions)
├── eas.json                    # EAS Build configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
│
├── assets/                     # Static assets in root (used by Expo config)
│   ├── icon.png               # App icon
│   ├── splash-icon.png        # Splash screen image
│   ├── adaptive-icon.png      # Android adaptive icon
│   ├── favicon.png            # Web favicon
│   ├── axys-logo.png          # Logo image
│   └── axys-logo.svg          # Logo vector
│
└── src/                        # Main source code
    ├── assets/                 # Assets used in components
    │   ├── axys-logo.png      # Logo for welcome screen
    │   ├── globe-background.png # Background image
    │   └── images/
    │       ├── pin-lock.png   # PIN setup illustration
    │       └── vault.png      # OTP screen illustration
    │
    ├── components/             # Reusable UI components
    │   ├── common/            # General purpose components
    │   │   ├── index.ts       # Barrel export
    │   │   ├── Button.tsx     # Primary button component
    │   │   ├── Input.tsx      # Text input with label and error
    │   │   ├── Header.tsx     # Screen header with back button
    │   │   ├── OtpInput.tsx   # 6-digit OTP input
    │   │   ├── PinInput.tsx   # 4-digit PIN input
    │   │   ├── CalendarPicker.tsx  # Date of birth picker
    │   │   └── ScreenContainer.tsx # Safe area wrapper
    │   │
    │   └── icons/             # SVG icon components
    │       ├── index.ts       # Barrel export
    │       ├── FaceIdIcon.tsx # Face ID illustration
    │       ├── FingerprintIcon.tsx # Fingerprint illustration
    │       └── PinLockIcon.tsx # PIN lock illustration
    │
    ├── constants/
    │   └── theme.ts           # Colors, fonts, spacing, border radius
    │
    ├── context/               # React Context providers
    │   ├── AuthContext.tsx    # Authentication state and methods
    │   ├── SignUpContext.tsx  # Sign up form data
    │   └── LanguageContext.tsx # Language selection
    │
    ├── i18n/                  # Internationalization
    │   ├── index.ts           # i18next configuration
    │   ├── en.ts              # English translations
    │   └── ja.ts              # Japanese translations
    │
    ├── navigation/
    │   └── RootNavigator.tsx  # Navigation structure and screen definitions
    │
    ├── screens/               # All app screens
    │   ├── DashboardScreen.tsx # Main screen after login
    │   │
    │   ├── onboarding/        # Initial screens
    │   │   ├── SplashScreen.tsx   # Loading screen
    │   │   └── WelcomeScreen.tsx  # Get Started / Login choice
    │   │
    │   └── auth/              # Authentication screens
    │       ├── SignUpEmailScreen.tsx      # Email/Phone input
    │       ├── SignUpOTPScreen.tsx        # Email OTP verification
    │       ├── SignUpPhoneScreen.tsx      # Phone number input
    │       ├── SignUpPhoneOTPScreen.tsx   # Phone OTP verification
    │       ├── SignUpPersonalInfoScreen.tsx # Name and DOB
    │       ├── SignUpPEPScreen.tsx        # PEP declaration
    │       ├── SignUpAddressScreen.tsx    # Address input
    │       ├── SignUpTermsScreen.tsx      # Terms acceptance
    │       ├── SignUpPasswordScreen.tsx   # Password creation
    │       ├── SignUpPinCodeScreen.tsx    # PIN setup
    │       ├── SignUpBiometricsScreen.tsx # Biometric setup
    │       ├── SignUpSuccessScreen.tsx    # Registration complete
    │       ├── LoginScreen.tsx            # Login with credentials
    │       ├── LoginPinCodeScreen.tsx     # PIN verification
    │       ├── LoginBiometricsScreen.tsx  # Biometric verification
    │       ├── ResumeWelcomeScreen.tsx    # Returning user welcome
    │       ├── ResumePinCodeScreen.tsx    # Quick PIN login
    │       └── ResumeBiometricsScreen.tsx # Quick biometric login
    │
    └── types/
        └── index.ts           # TypeScript type definitions
```

---

## Screens and Navigation Flow

### Sign Up Flow

The sign up process is designed to collect information step by step, so users don't feel overwhelmed:

```
Welcome Screen
    ↓
SignUpEmail (Email or Phone tab selection)
    ↓
SignUpOTP (6-digit code verification)
    ↓
SignUpPersonalInfo (First name, Middle name, Last name, DOB, Nationality)
    ↓
SignUpPEP (Politically Exposed Person declaration)
    ↓
SignUpAddress (Country, Address, City, Postal Code)
    ↓
SignUpPassword (Password with requirements validation)
    ↓
SignUpPinCode (4-digit PIN creation and confirmation)
    ↓
SignUpBiometrics (Face ID / Fingerprint setup - optional)
    ↓
SignUpSuccess (Account created confirmation)
    ↓
Dashboard
```

Each screen has a progress bar at the top showing completion percentage. Users can go back to previous screens if they need to change something.

### Login Flow

For users who have an account but aren't logged in:

```
Welcome Screen
    ↓
LoginScreen (Email/Phone + Password)
    ↓
LoginPinCode (PIN verification)
    ↓
Dashboard
```

If biometrics are enabled, users can authenticate with Face ID or Fingerprint instead of entering the PIN.

### Resume Flow

For returning users who have completed onboarding and have an active session:

```
Splash Screen (checks auth state)
    ↓
ResumeWelcome (shows user greeting)
    ↓
ResumeBiometrics or ResumePinCode
    ↓
Dashboard
```

This flow is faster because we already have the user's data stored securely. They just need to verify their identity.

---

## Component Documentation

### Button (`src/components/common/Button.tsx`)

A flexible button component with three variants:

```tsx
// Primary - white background, black text (main CTAs)
<Button title="Continue" onPress={handleContinue} variant="primary" />

// Secondary - dark gray background, white text (secondary actions)
<Button title="Skip" onPress={handleSkip} variant="secondary" />

// Outline - transparent with border (tertiary actions)
<Button title="Cancel" onPress={handleCancel} variant="outline" />
```

The button also handles loading states and disabled states. When loading, it shows an ActivityIndicator instead of the title.

I used `React.memo` to prevent unnecessary re-renders. The button doesn't need to re-render unless its props change.

### Input (`src/components/common/Input.tsx`)

Text input with label, error message, and password toggle:

```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Password input with show/hide toggle
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  showPasswordToggle
  secureTextEntry
/>
```

The password toggle is built into the component. When `showPasswordToggle` is true, an eye icon appears that toggles password visibility.

### Header (`src/components/common/Header.tsx`)

Screen header with back button and optional progress bar:

```tsx
<Header
  onBack={() => navigation.goBack()}
  showProgress
  progress={45}  // percentage
/>
```

The header handles safe area insets properly. On Android, it accounts for the status bar height. On iOS, it uses `useSafeAreaInsets` for the notch.

### OtpInput (`src/components/common/OtpInput.tsx`)

6-digit OTP input that auto-advances focus:

```tsx
<OtpInput
  value={otp}
  onChange={setOtp}
  length={6}
/>
```

Each digit has its own box. When you type a digit, focus automatically moves to the next box. Backspace moves focus back. This gives a much better UX than a single text input.

### PinInput (`src/components/common/PinInput.tsx`)

Similar to OTP but for 4-digit PIN codes. Shows dots instead of numbers for security:

```tsx
<PinInput
  value={pin}
  onChange={setPin}
  length={4}
/>
```

### CalendarPicker (`src/components/common/CalendarPicker.tsx`)

Date picker for selecting date of birth:

```tsx
<CalendarPicker
  value={dateOfBirth}
  onChange={setDateOfBirth}
  label="Date of Birth"
/>
```

On iOS, this shows the native date picker wheel. On Android, it shows the Material Design date picker. The date is formatted according to the user's locale.

---

## State Management

I chose React Context over Redux because the app's state requirements are straightforward. Three contexts handle all the state:

### AuthContext (`src/context/AuthContext.tsx`)

Manages authentication state across the entire app:

```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  hasBiometricsSetup: boolean;
  hasPinSetup: boolean;
}
```

**Methods provided:**
- `signUp(data)` - Creates new account and stores user data
- `signIn(identifier, password)` - Authenticates existing user
- `signOut()` - Clears auth token
- `setPin(pin)` - Stores PIN securely
- `verifyPin(pin)` - Validates entered PIN
- `setBiometrics(enabled)` - Enables/disables biometric auth
- `setBiometricType(type)` - Stores whether user chose Face ID or Fingerprint
- `checkAuthState()` - Checks stored tokens on app launch

All sensitive data (user info, PIN, auth token) is stored using `expo-secure-store` which encrypts data on device.

### SignUpContext (`src/context/SignUpContext.tsx`)

Holds form data during the sign-up process:

```tsx
interface SignUpData {
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  isPEP: boolean | null;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  password: string;
  pin: string;
}
```

This context persists data as users move through screens. If they go back and change something, their other inputs are preserved. The `resetSignUpData()` method clears everything after successful registration.

### LanguageContext (`src/context/LanguageContext.tsx`)

Manages language selection:

```tsx
const { language, setLanguage } = useLanguage();

// Change language
setLanguage('ja'); // Switch to Japanese
```

Language preference is persisted to storage. When the app launches, it reads the stored preference and applies it.

---

## Internationalization

The app supports English and Japanese. Translation files are in `src/i18n/`:

### Adding Translations

Each language has its own file (`en.ts`, `ja.ts`) with nested objects:

```typescript
// en.ts
export default {
  welcome: {
    title: 'Your money.',
    subtitle: 'Your control.',
    getStarted: 'Get Started',
    logIn: 'Log In',
  },
  signUp: {
    createAccount: 'Create Account',
    email: 'Email',
    phone: 'Phone',
    // ... more translations
  },
};
```

### Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <Text>{t('welcome.title')}</Text>  // "Your money."
  );
};
```

### Adding a New Language

1. Create a new file `src/i18n/xx.ts` (where xx is the language code)
2. Copy the structure from `en.ts` and translate all strings
3. Import and add it to `src/i18n/index.ts`:

```typescript
import xx from './xx';

i18n.init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    xx: { translation: xx },  // Add new language
  },
});
```

4. Add the language option in WelcomeScreen's language selector

---

## Security Implementation

### Secure Storage

All sensitive data is stored using `expo-secure-store`:

- **Auth Token** - Used to maintain session
- **PIN Code** - 4-digit PIN (stored as plain text in secure store, which is encrypted)
- **User Data** - JSON stringified user object
- **Biometric Settings** - Whether biometrics are enabled and which type

The secure store uses:
- iOS Keychain on Apple devices
- Android Keystore on Android devices

Data is encrypted at rest and requires device authentication to access.

### Biometric Authentication

The app uses `expo-local-authentication` for biometrics:

```typescript
// Check if device supports biometrics
const compatible = await LocalAuthentication.hasHardwareAsync();

// Check if biometrics are enrolled
const enrolled = await LocalAuthentication.isEnrolledAsync();

// Get available types (Face ID, Fingerprint)
const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

// Authenticate
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Authenticate to continue',
  cancelLabel: 'Cancel',
  disableDeviceFallback: false,
});
```

The app detects which biometric type is available:
- If only Face ID is available, it shows the Face ID setup screen
- If only Fingerprint is available, it shows the Fingerprint setup screen
- If both are available, it lets the user choose

### Password Requirements

Passwords must meet these requirements (validated in real-time):

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

The UI shows each requirement with a bullet point (not met) or checkmark (met).

---

## Known Limitations

### Address Autocomplete Not Implemented

The address input screen (`SignUpAddressScreen.tsx`) uses manual text inputs instead of Google Places Autocomplete. This is because:

**No Google API key was provided for this project.**

To add address autocomplete, you would need to:

1. Get a Google Places API key from Google Cloud Console
2. Install `react-native-google-places-autocomplete`
3. Replace the address Input component with the autocomplete component
4. Configure the API key in the component

The current implementation works fine for entering addresses manually - it just doesn't provide autocomplete suggestions.

### Mock OTP Verification

The OTP verification screens (`SignUpOTPScreen`, `SignUpPhoneOTPScreen`) accept any 6-digit code. In production, you would:

1. Send actual SMS/Email with the code via a backend service
2. Verify the entered code against the sent code
3. Handle expiration and resend logic

Currently, the countdown timer is visual only and any 6-digit code will pass verification.

### Mock Authentication

The login flow doesn't validate passwords against a real backend. It checks if a user exists in secure storage and accepts any password. For production:

1. Integrate with your authentication backend
2. Validate credentials server-side
3. Handle token refresh

### Supabase Not Fully Integrated

The `@supabase/supabase-js` package is installed but not configured. The app uses local secure storage for all data. To integrate Supabase:

1. Create a Supabase project
2. Add your Supabase URL and anon key
3. Create database tables for users
4. Replace secure store calls with Supabase queries

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For Android builds: Android Studio with SDK
- For iOS builds: Xcode (macOS only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/franol-geleta/AxysApp.git
cd AxysApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on device/emulator:
```bash
# Android
npm run android

# iOS
npm run ios
```

### Environment Setup

No environment variables are required for the current implementation. If you add Supabase:

1. Create a `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. Access in code:
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
```

---

## Building the APK

### Using Expo Prebuild (Local Build)

1. Generate native Android project:
```bash
npx expo prebuild --platform android
```

2. Create `android/local.properties` with your SDK path:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

3. Build the APK:
```bash
cd android
./gradlew assembleRelease
```

4. Find the APK at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Using EAS Build (Cloud Build)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Build:
```bash
eas build --platform android --profile preview
```

The APK will be available for download from the Expo dashboard.

---

## Download

Pre-built APK is available in the [Releases](https://github.com/franol-geleta/AxysApp/releases) section.

---

## License

This project is private and not licensed for public use.
