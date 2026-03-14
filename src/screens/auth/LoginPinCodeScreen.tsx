import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Header, PinInput, Button } from '../../components/common';
import { PinLockIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginPinCode'>;

interface Props {
  navigation: NavigationProp;
}

export const LoginPinCodeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { verifyPin, hasBiometricsSetup } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (pin.length === 4) {
      handleVerify();
    }
  }, [pin]);

  const handleVerify = async () => {
    const isValid = await verifyPin(pin);
    if (isValid) {
      if (hasBiometricsSetup) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('LoginBiometrics');
      }
    } else {
      setError(t('pin.invalidPin'));
      setPin('');
    }
  };

  const handleForgotPin = () => {
    // Navigate to forgot PIN flow
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <PinLockIcon size={100} />
        </View>

        <Text style={styles.title}>{t('pin.enterTitle')}</Text>
        <Text style={styles.subtitle}>{t('pin.enterSubtitle')}</Text>

        <View style={styles.pinContainer}>
          <PinInput
            value={pin}
            onChange={(value) => {
              setError('');
              setPin(value);
            }}
            length={4}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPin}>
          <Text style={styles.forgotButtonText}>{t('pin.forgotPin')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  pinContainer: {
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  forgotButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  forgotButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});
