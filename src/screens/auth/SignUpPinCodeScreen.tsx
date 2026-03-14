import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, FONTS } from '../../constants/theme';
import type { RootStackParamList } from '../../types';
import { Button, Header, PinInput } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpPinCode'>;
type PinStep = 'create' | 'confirm';

interface Props {
  navigation: NavigationProp;
}

const PIN_LENGTH = 4;
const PIN_TRANSITION_DELAY = 300;

export const SignUpPinCodeScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { updateSignUpData } = useSignUp();
  const { setPin: savePin } = useAuth();

  const [pin, setPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<PinStep>('create');
  const [error, setError] = useState('');

  const handlePinChange = useCallback((value: string) => {
    setError('');
    if (step === 'create') {
      setPinValue(value);
    } else {
      setConfirmPin(value);
    }
  }, [step]);

  const handleComplete = useCallback(async () => {
    try {
      updateSignUpData({ pin });
      await savePin(pin);
      navigation.navigate('SignUpBiometrics');
    } catch {
      setError('Failed to save PIN');
    }
  }, [pin, updateSignUpData, savePin, navigation]);

  useEffect(() => {
    if (step === 'create' && pin.length === PIN_LENGTH) {
      const timer = setTimeout(() => setStep('confirm'), PIN_TRANSITION_DELAY);
      return () => clearTimeout(timer);
    }
  }, [pin, step]);

  useEffect(() => {
    if (step === 'confirm' && confirmPin.length === PIN_LENGTH) {
      if (confirmPin === pin) {
        handleComplete();
      } else {
        setError('PINs do not match');
        setConfirmPin('');
      }
    }
  }, [confirmPin, step, pin, handleComplete]);

  const handleBack = useCallback(() => {
    if (step === 'confirm') {
      setStep('create');
      setConfirmPin('');
      setPinValue('');
    } else {
      navigation.goBack();
    }
  }, [step, navigation]);

  const handleNextPress = useCallback(() => {
    if (step === 'create' && pin.length === PIN_LENGTH) {
      setStep('confirm');
    }
  }, [step, pin]);

  const isNextDisabled = step === 'create'
    ? pin.length !== PIN_LENGTH
    : confirmPin.length !== PIN_LENGTH;

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} showProgress progress={85} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/pin-lock.png')}
            style={styles.pinLockImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          {step === 'create' ? t('pin.createTitle') : t('pin.confirmTitle')}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'create' ? t('pin.createSubtitle') : t('pin.confirmSubtitle')}
        </Text>

        <View style={styles.pinContainer}>
          <PinInput
            value={step === 'create' ? pin : confirmPin}
            onChange={handlePinChange}
            length={PIN_LENGTH}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Button
          title={t('common.next')}
          onPress={handleNextPress}
          disabled={isNextDisabled}
        />
      </View>
    </View>
  );
});

SignUpPinCodeScreen.displayName = 'SignUpPinCodeScreen';

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
  pinLockImage: {
    width: 120,
    height: 120,
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
    marginBottom: SPACING.xl,
  },
  pinContainer: {
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    marginTop: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});
