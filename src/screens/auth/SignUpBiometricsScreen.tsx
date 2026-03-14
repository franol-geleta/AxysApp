import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONTS } from '../../constants/theme';
import type { RootStackParamList } from '../../types';
import { Button, Header } from '../../components/common';
import { FaceIdIcon, FingerprintIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpBiometrics'>;
type BiometricType = 'face' | 'fingerprint' | 'both' | 'none';
type BiometricTab = 'fingerprint' | 'face';

interface Props {
  navigation: NavigationProp;
}

export const SignUpBiometricsScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { setBiometrics, setBiometricType, signUp, setOnboardingComplete } = useAuth();
  const { signUpData } = useSignUp();
  const [deviceBiometricType, setDeviceBiometricType] = useState<BiometricType>('none');
  const [selectedTab, setSelectedTab] = useState<BiometricTab>('fingerprint');
  const [isLoading, setIsLoading] = useState(false);

  const checkBiometricSupport = useCallback(async () => {
    try {
      // Check if device has biometric hardware
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setDeviceBiometricType('none');
        return;
      }

      // Check if biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);

      if (!enrolled) {
        setDeviceBiometricType('none');
        return;
      }

      // Get supported authentication types
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const hasFace = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

      if (hasFace && hasFingerprint) {
        setDeviceBiometricType('both');
        setSelectedTab('face'); // Default to Face ID when both available
      } else if (hasFace) {
        setDeviceBiometricType('face');
      } else if (hasFingerprint) {
        setDeviceBiometricType('fingerprint');
      } else {
        setDeviceBiometricType('none');
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setDeviceBiometricType('none');
    }
  }, []);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  const completeSignUp = useCallback(async () => {
    try {
      setIsLoading(true);
      await signUp({
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        firstName: signUpData.firstName,
        middleName: signUpData.middleName,
        lastName: signUpData.lastName,
        dateOfBirth: signUpData.dateOfBirth,
        nationality: signUpData.nationality,
        isPEP: signUpData.isPEP || false,
        country: signUpData.country,
        address: signUpData.address,
        city: signUpData.city,
        postalCode: signUpData.postalCode,
      });
      await setOnboardingComplete();
      navigation.replace('SignUpSuccess');
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, [signUpData, signUp, setOnboardingComplete, navigation]);

  const handleSetupBiometrics = useCallback(async () => {
    try {
      setIsLoading(true);

      // Determine which biometric type to use
      const useFaceId = deviceBiometricType === 'face' || (deviceBiometricType === 'both' && selectedTab === 'face');
      const promptMessage = useFaceId ? t('biometrics.setupFaceId') : t('biometrics.setupFingerprint');

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: t('common.cancel'),
        disableDeviceFallback: false,
        fallbackLabel: Platform.OS === 'ios' ? t('common.cancel') : undefined,
      });

      if (result.success) {
        // Save biometrics enabled and the type
        await setBiometrics(true);
        if (setBiometricType) {
          await setBiometricType(useFaceId ? 'face' : 'fingerprint');
        }
        await completeSignUp();
      } else if (result.error === 'user_cancel') {
        // User cancelled, do nothing
      } else if (result.error === 'not_enrolled') {
        Alert.alert(
          t('biometrics.notEnrolled'),
          t('biometrics.notEnrolledMessage'),
          [{ text: t('common.confirm') }]
        );
      } else {
        Alert.alert(
          t('biometrics.authFailed'),
          t('biometrics.authFailedMessage'),
          [{ text: t('common.confirm') }]
        );
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert(
        t('biometrics.error'),
        t('biometrics.errorMessage'),
        [{ text: t('common.confirm') }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [deviceBiometricType, selectedTab, t, setBiometrics, setBiometricType, completeSignUp]);

  const handleSkip = useCallback(async () => {
    await completeSignUp();
  }, [completeSignUp]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const selectFingerprintTab = useCallback(() => setSelectedTab('fingerprint'), []);
  const selectFaceTab = useCallback(() => setSelectedTab('face'), []);

  // Render Face ID only screen
  const renderFaceIdScreen = () => (
    <>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FaceIdIcon size={100} color={COLORS.text} />
        </View>
        <Text style={styles.title}>{t('biometrics.setupTitle')}</Text>
        <Text style={styles.subtitle}>{t('biometrics.subtitleFaceId')}</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title={t('biometrics.setupFaceId')}
          onPress={handleSetupBiometrics}
          loading={isLoading}
        />
        <Button
          title={t('common.skip')}
          onPress={handleSkip}
          variant="secondary"
          style={styles.skipButton}
          loading={isLoading}
        />
      </View>
    </>
  );

  // Render Fingerprint only screen
  const renderFingerprintScreen = () => (
    <>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FingerprintIcon size={100} color={COLORS.text} />
        </View>
        <Text style={styles.title}>{t('biometrics.setupTitleFingerprint')}</Text>
        <Text style={styles.subtitle}>{t('biometrics.subtitleFingerprint')}</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title={t('biometrics.setupFingerprint')}
          onPress={handleSetupBiometrics}
          loading={isLoading}
        />
        <Button
          title={t('common.skip')}
          onPress={handleSkip}
          variant="secondary"
          style={styles.skipButton}
          loading={isLoading}
        />
      </View>
    </>
  );

  // Render Biometrics screen (both Face ID and Fingerprint available)
  const renderBiometricsScreen = () => (
    <>
      <View style={styles.content}>
        <View style={styles.iconRow}>
          <FaceIdIcon size={50} color={COLORS.text} />
          <FingerprintIcon size={50} color={COLORS.text} />
        </View>
        <Text style={styles.title}>{t('biometrics.setupTitleGeneric')}</Text>
        <Text style={styles.subtitle}>{t('biometrics.subtitle')}</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'fingerprint' && styles.tabActive]}
            onPress={selectFingerprintTab}
          >
            <Text style={[styles.tabText, selectedTab === 'fingerprint' && styles.tabTextActive]}>
              {t('biometrics.fingerprint')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'face' && styles.tabActive]}
            onPress={selectFaceTab}
          >
            <Text style={[styles.tabText, selectedTab === 'face' && styles.tabTextActive]}>
              {t('biometrics.face')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          title={t('biometrics.setupButton')}
          onPress={handleSetupBiometrics}
          loading={isLoading}
        />
        <Button
          title={t('common.skip')}
          onPress={handleSkip}
          variant="secondary"
          style={styles.skipButton}
          loading={isLoading}
        />
      </View>
    </>
  );

  // Render no biometrics available
  const renderNoBiometrics = () => (
    <>
      <View style={styles.content}>
        <Text style={styles.title}>{t('biometrics.notAvailable')}</Text>
        <Text style={styles.subtitle}>{t('biometrics.notAvailableSubtitle')}</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title={t('common.continue')}
          onPress={handleSkip}
          loading={isLoading}
        />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} showProgress progress={95} />

      {deviceBiometricType === 'face' && renderFaceIdScreen()}
      {deviceBiometricType === 'fingerprint' && renderFingerprintScreen()}
      {deviceBiometricType === 'both' && renderBiometricsScreen()}
      {deviceBiometricType === 'none' && renderNoBiometrics()}
    </View>
  );
});

SignUpBiometricsScreen.displayName = 'SignUpBiometricsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.semiBold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    marginTop: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  skipButton: {
    backgroundColor: COLORS.surface,
  },
});
