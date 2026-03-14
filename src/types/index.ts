export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  isPEP?: boolean;
  country?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  hasBiometrics?: boolean;
  hasPin?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  hasBiometricsSetup: boolean;
  hasPinSetup: boolean;
}

export interface SignUpData {
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  isPEP: boolean;
  country: string;
  address: string;
  city: string;
  postalCode: string;
}

export type Language = 'en' | 'ja';

export interface Country {
  code: string;
  name: string;
  nameJa: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  // Auth Flow - Phone Signup
  SignUpPhone: undefined;
  SignUpPhoneOTP: { phone: string };
  // Auth Flow - Email & Rest
  SignUpEmail: undefined;
  SignUpTerms: undefined;
  SignUpOTP: { email: string };
  SignUpPersonalInfo: undefined;
  SignUpPEP: undefined;
  SignUpAddress: undefined;
  SignUpPassword: undefined;
  SignUpPinCode: undefined;
  SignUpBiometrics: undefined;
  SignUpSuccess: undefined;
  // Login Flow
  Login: undefined;
  LoginPinCode: undefined;
  LoginBiometrics: undefined;
  // Resume Flow
  ResumeWelcome: undefined;
  ResumePinCode: undefined;
  ResumeBiometrics: undefined;
  // Main App
  Dashboard: undefined;
};
