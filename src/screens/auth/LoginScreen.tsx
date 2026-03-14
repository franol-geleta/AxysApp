import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONTS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button, Input, Header, ScreenContainer } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type AuthTab = 'email' | 'phone';

interface Props {
  navigation: NavigationProp;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_LENGTH = 10;
const MIN_PASSWORD_LENGTH = 8;

export const LoginScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isValidPhone = useMemo(() => phone.length >= MIN_PHONE_LENGTH, [phone]);

  const canLogin = useMemo(() => {
    const hasValidIdentifier = activeTab === 'email' ? isValidEmail : isValidPhone;
    return hasValidIdentifier && password.length >= MIN_PASSWORD_LENGTH;
  }, [activeTab, isValidEmail, isValidPhone, password]);

  const handleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const identifier = activeTab === 'email' ? email : phone;
      await signIn(identifier, password);
      navigation.replace('LoginPinCode');
    } catch {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, email, phone, password, signIn, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const selectEmailTab = useCallback(() => setActiveTab('email'), []);
  const selectPhoneTab = useCallback(() => setActiveTab('phone'), []);

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('login.welcome')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.tabActive]}
              onPress={selectEmailTab}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
                {t('login.email')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.tabActive]}
              onPress={selectPhoneTab}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.tabTextActive]}>
                {t('login.phoneNumber')}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'email' ? (
            <Input
              label={t('login.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          ) : (
            <Input
              label={t('login.phoneNumber')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}

          <Input
            label={t('login.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.footer}>
          <Button
            title={t('login.logIn')}
            onPress={handleLogin}
            disabled={!canLogin}
            loading={isLoading}
          />
        </View>
      </ScreenContainer>
    </View>
  );
});

LoginScreen.displayName = 'LoginScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.semiBold,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    marginTop: SPACING.md,
  },
  footer: {
    paddingBottom: SPACING.lg,
  },
});
