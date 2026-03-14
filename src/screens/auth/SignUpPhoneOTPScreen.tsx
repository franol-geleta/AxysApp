import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Header, OtpInput } from '../../components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpPhoneOTP'>;
type RouteProps = RouteProp<RootStackParamList, 'SignUpPhoneOTP'>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

export const SignUpPhoneOTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      // Verify OTP - for demo, accept any 6-digit code
      setTimeout(() => {
        navigation.navigate('SignUpPersonalInfo');
      }, 500);
    }
  }, [otp, navigation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskPhoneNumber = (phoneNum: string) => {
    if (phoneNum.length < 4) return phoneNum;
    const lastFour = phoneNum.slice(-4);
    const masked = '*'.repeat(phoneNum.length - 4);
    return `${masked}${lastFour}`;
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} showProgress progress={30} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/vault.png')}
            style={styles.vaultImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t('otp.verifyPhone')}</Text>
        <Text style={styles.subtitle}>
          {t('otp.sentCode')} {maskPhoneNumber(phone)}. {t('otp.codeExpires')}
        </Text>

        <View style={styles.otpContainer}>
          <OtpInput value={otp} onChange={setOtp} length={6} />
        </View>

        <Text style={styles.resendText}>
          {countdown > 0
            ? `${t('otp.resendCode')} ${formatTime(countdown)}`
            : t('otp.resendNow')}
        </Text>
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
  vaultImage: {
    width: 120,
    height: 120,
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
  },
});
