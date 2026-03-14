import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumeWelcome'>;

interface Props {
  navigation: NavigationProp;
}

export const ResumeWelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, hasBiometricsSetup, verifyPin } = useAuth();
  const { language } = useLanguage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint' | 'none'>('none');

  useEffect(() => {
    checkBiometricType();
  }, []);

  useEffect(() => {
    if (hasBiometricsSetup && biometricType !== 'none') {
      handleBiometricAuth();
    }
  }, [biometricType]);

  const checkBiometricType = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        }
      }
    } catch (error) {
      console.error('Error checking biometric type:', error);
    }
  };

  const getBiometricButtonText = () => {
    switch (biometricType) {
      case 'face':
        return t('welcome.useFaceId');
      case 'fingerprint':
        return t('welcome.useFingerprint');
      default:
        return t('welcome.useBiometrics');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: getBiometricButtonText(),
        fallbackLabel: t('welcome.usePinCode'),
      });

      if (result.success) {
        navigation.replace('Dashboard');
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUsePinCode = () => {
    navigation.navigate('ResumePinCode');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/globe-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/axys-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageIcon}>🌐</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer to push content down */}
          <View style={styles.spacer} />

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.welcomeText}>
              {t('welcome.welcomeBack')} {user?.firstName || 'User'}
            </Text>

            <View style={styles.buttonContainer}>
              {hasBiometricsSetup && biometricType !== 'none' && (
                <Button
                  title={getBiometricButtonText()}
                  onPress={handleBiometricAuth}
                  variant="primary"
                  loading={isAuthenticating}
                />
              )}
              <Button
                title={t('welcome.usePinCode')}
                onPress={handleUsePinCode}
                variant={hasBiometricsSetup && biometricType !== 'none' ? 'secondary' : 'primary'}
                style={hasBiometricsSetup && biometricType !== 'none' ? styles.pinButton : undefined}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: {
    width: 100,
    height: 45,
  },
  languageButton: {
    padding: SPACING.sm,
  },
  languageIcon: {
    fontSize: FONT_SIZES.xl,
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  welcomeText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '300',
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  pinButton: {
    backgroundColor: COLORS.surface,
  },
});
