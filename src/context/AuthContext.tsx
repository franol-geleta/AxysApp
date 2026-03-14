import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import type { User, AuthState, SignUpData } from '../types';

type BiometricType = 'face' | 'fingerprint' | null;

interface AuthContextValue extends AuthState {
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  setBiometrics: (enabled: boolean) => Promise<void>;
  setBiometricType: (type: 'face' | 'fingerprint') => Promise<void>;
  biometricType: BiometricType;
  updateUser: (data: Partial<User>) => void;
  setOnboardingComplete: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER: 'axys_user',
  PIN: 'axys_pin',
  BIOMETRICS: 'axys_biometrics',
  BIOMETRIC_TYPE: 'axys_biometric_type',
  ONBOARDING: 'axys_onboarding',
  AUTH_TOKEN: 'axys_auth_token',
} as const;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedOnboarding: false,
  hasBiometricsSetup: false,
  hasPinSetup: false,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [biometricType, setBiometricTypeState] = useState<BiometricType>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const [userJson, pin, biometrics, storedBiometricType, onboarding, token] =
        await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.USER),
          SecureStore.getItemAsync(STORAGE_KEYS.PIN),
          SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRICS),
          SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_TYPE),
          SecureStore.getItemAsync(STORAGE_KEYS.ONBOARDING),
          SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN),
        ]);

      const user = userJson ? JSON.parse(userJson) : null;

      setState({
        user,
        isAuthenticated: Boolean(token && user),
        isLoading: false,
        hasCompletedOnboarding: onboarding === 'true',
        hasBiometricsSetup: biometrics === 'true',
        hasPinSetup: Boolean(pin),
      });

      if (storedBiometricType === 'face' || storedBiometricType === 'fingerprint') {
        setBiometricTypeState(storedBiometricType);
      }
    } catch (error) {
      console.error('Failed to check auth state:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const signUp = useCallback(async (data: SignUpData) => {
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      isPEP: data.isPEP,
      country: data.country,
      createdAt: new Date().toISOString(),
    };

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)),
      SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token),
    ]);

    setState(prev => ({ ...prev, user, isAuthenticated: true }));
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);

    if (!userJson) {
      throw new Error('User not found');
    }

    const user = JSON.parse(userJson);
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    setState(prev => ({ ...prev, user, isAuthenticated: true }));
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    setState(prev => ({ ...prev, isAuthenticated: false }));
  }, []);

  const setPin = useCallback(async (pin: string) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.PIN, pin);
    setState(prev => ({ ...prev, hasPinSetup: true }));
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    const storedPin = await SecureStore.getItemAsync(STORAGE_KEYS.PIN);
    return storedPin === pin;
  }, []);

  const setBiometrics = useCallback(async (enabled: boolean) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRICS, String(enabled));
    setState(prev => ({ ...prev, hasBiometricsSetup: enabled }));
  }, []);

  const setBiometricType = useCallback(async (type: 'face' | 'fingerprint') => {
    await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_TYPE, type);
    setBiometricTypeState(type);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  }, []);

  const setOnboardingComplete = useCallback(async () => {
    await SecureStore.setItemAsync(STORAGE_KEYS.ONBOARDING, 'true');
    setState(prev => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      biometricType,
      signUp,
      signIn,
      signOut,
      setPin,
      verifyPin,
      setBiometrics,
      setBiometricType,
      updateUser,
      setOnboardingComplete,
      checkAuthState,
    }),
    [
      state,
      biometricType,
      signUp,
      signIn,
      signOut,
      setPin,
      verifyPin,
      setBiometrics,
      setBiometricType,
      updateUser,
      setOnboardingComplete,
      checkAuthState,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
