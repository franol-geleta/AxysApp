import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Onboarding Screens
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';

// Auth Screens - Sign Up (Phone)
import { SignUpPhoneScreen } from '../screens/auth/SignUpPhoneScreen';
import { SignUpPhoneOTPScreen } from '../screens/auth/SignUpPhoneOTPScreen';

// Auth Screens - Sign Up (Email & Rest)
import { SignUpEmailScreen } from '../screens/auth/SignUpEmailScreen';
import { SignUpTermsScreen } from '../screens/auth/SignUpTermsScreen';
import { SignUpOTPScreen } from '../screens/auth/SignUpOTPScreen';
import { SignUpPersonalInfoScreen } from '../screens/auth/SignUpPersonalInfoScreen';
import { SignUpPEPScreen } from '../screens/auth/SignUpPEPScreen';
import { SignUpAddressScreen } from '../screens/auth/SignUpAddressScreen';
import { SignUpPasswordScreen } from '../screens/auth/SignUpPasswordScreen';
import { SignUpPinCodeScreen } from '../screens/auth/SignUpPinCodeScreen';
import { SignUpBiometricsScreen } from '../screens/auth/SignUpBiometricsScreen';
import { SignUpSuccessScreen } from '../screens/auth/SignUpSuccessScreen';

// Auth Screens - Login
import { LoginScreen } from '../screens/auth/LoginScreen';
import { LoginPinCodeScreen } from '../screens/auth/LoginPinCodeScreen';
import { LoginBiometricsScreen } from '../screens/auth/LoginBiometricsScreen';

// Auth Screens - Resume
import { ResumeWelcomeScreen } from '../screens/auth/ResumeWelcomeScreen';
import { ResumePinCodeScreen } from '../screens/auth/ResumePinCodeScreen';
import { ResumeBiometricsScreen } from '../screens/auth/ResumeBiometricsScreen';

// Main Screens
import { DashboardScreen } from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      {/* Onboarding */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Sign Up Flow - Phone Verification */}
      <Stack.Screen name="SignUpPhone" component={SignUpPhoneScreen} />
      <Stack.Screen name="SignUpPhoneOTP" component={SignUpPhoneOTPScreen} />

      {/* Sign Up Flow - Email & Rest */}
      <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
      <Stack.Screen name="SignUpTerms" component={SignUpTermsScreen} />
      <Stack.Screen name="SignUpOTP" component={SignUpOTPScreen} />
      <Stack.Screen name="SignUpPersonalInfo" component={SignUpPersonalInfoScreen} />
      <Stack.Screen name="SignUpPEP" component={SignUpPEPScreen} />
      <Stack.Screen name="SignUpAddress" component={SignUpAddressScreen} />
      <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} />
      <Stack.Screen name="SignUpPinCode" component={SignUpPinCodeScreen} />
      <Stack.Screen name="SignUpBiometrics" component={SignUpBiometricsScreen} />
      <Stack.Screen name="SignUpSuccess" component={SignUpSuccessScreen} />

      {/* Login Flow */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginPinCode" component={LoginPinCodeScreen} />
      <Stack.Screen name="LoginBiometrics" component={LoginBiometricsScreen} />

      {/* Resume Flow */}
      <Stack.Screen name="ResumeWelcome" component={ResumeWelcomeScreen} />
      <Stack.Screen name="ResumePinCode" component={ResumePinCodeScreen} />
      <Stack.Screen name="ResumeBiometrics" component={ResumeBiometricsScreen} />

      {/* Main App */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};
