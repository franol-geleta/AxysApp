import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, FONTS } from '../../constants/theme';
import type { RootStackParamList } from '../../types';
import { Header, OtpInput } from '../../components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpOTP'>;
type RouteProps = RouteProp<RootStackParamList, 'SignUpOTP'>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 59;
const NAVIGATION_DELAY = 500;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const SignUpOTPScreen: React.FC<Props> = memo(({ navigation, route }) => {
  const { t } = useTranslation();
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      const timer = setTimeout(() => {
        navigation.navigate('SignUpPersonalInfo');
      }, NAVIGATION_DELAY);
      return () => clearTimeout(timer);
    }
  }, [otp, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const resendText = countdown > 0
    ? `${t('otp.resendCode')} ${formatTime(countdown)}`
    : t('otp.resendNow');

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} showProgress progress={15} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/vault.png')}
            style={styles.vaultImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t('otp.verifyEmail')}</Text>
        <Text style={styles.subtitle}>
          {t('otp.sentCode')} {email}. {t('otp.codeExpires')}
        </Text>

        <View style={styles.otpContainer}>
          <OtpInput value={otp} onChange={setOtp} length={OTP_LENGTH} />
        </View>

        <Text style={styles.resendText}>{resendText}</Text>
      </View>
    </View>
  );
});

SignUpOTPScreen.displayName = 'SignUpOTPScreen';

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
  vaultImage: {
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
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  otpContainer: {
    marginBottom: SPACING.xl,
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
  },
});
