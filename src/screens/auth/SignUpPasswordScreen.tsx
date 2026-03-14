import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, FONTS } from '../../constants/theme';
import type { RootStackParamList } from '../../types';
import { Button, Input, Header, ScreenContainer } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpPassword'>;

interface Props {
  navigation: NavigationProp;
}

interface PasswordRequirement {
  key: string;
  label: string;
  validator: RegExp | ((pwd: string) => boolean);
}

const MIN_PASSWORD_LENGTH = 8;

const createRequirements = (t: (key: string) => string): PasswordRequirement[] => [
  { key: 'minLength', label: t('password.requirements.minLength'), validator: pwd => pwd.length >= MIN_PASSWORD_LENGTH },
  { key: 'uppercase', label: t('password.requirements.uppercase'), validator: /[A-Z]/ },
  { key: 'lowercase', label: t('password.requirements.lowercase'), validator: /[a-z]/ },
  { key: 'number', label: t('password.requirements.number'), validator: /[0-9]/ },
  { key: 'special', label: t('password.requirements.special'), validator: /[!@#$%^&*(),.?":{}|<>]/ },
];

const checkRequirement = (password: string, validator: RegExp | ((pwd: string) => boolean)): boolean => {
  if (typeof validator === 'function') {
    return validator(password);
  }
  return validator.test(password);
};

export const SignUpPasswordScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { updateSignUpData } = useSignUp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = useMemo(() => createRequirements(t), [t]);

  const requirementsMet = useMemo(() => {
    return requirements.map(req => ({
      ...req,
      met: checkRequirement(password, req.validator),
    }));
  }, [password, requirements]);

  const allRequirementsMet = useMemo(
    () => requirementsMet.every(req => req.met),
    [requirementsMet]
  );

  const passwordsMatch = useMemo(
    () => password === confirmPassword && confirmPassword.length > 0,
    [password, confirmPassword]
  );

  const canProceed = useMemo(
    () => allRequirementsMet && passwordsMatch,
    [allRequirementsMet, passwordsMatch]
  );

  const handleNext = useCallback(() => {
    updateSignUpData({ password });
    navigation.navigate('SignUpPinCode');
  }, [password, updateSignUpData, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} showProgress progress={75} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('password.createTitle')}</Text>
          <Text style={styles.subtitle}>{t('password.createSubtitle')}</Text>

          <Input
            label={t('password.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
          />

          <View style={styles.requirementsContainer}>
            {requirementsMet.map(req => (
              <View key={req.key} style={styles.requirementRow}>
                <Text style={[styles.indicator, req.met && styles.indicatorMet]}>
                  {req.met ? '✓' : '•'}
                </Text>
                <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          <Input
            label={t('password.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
            placeholder={t('password.confirmPassword')}
          />

          {passwordsMatch && (
            <View style={styles.matchContainer}>
              <Text style={styles.matchIndicator}>✓</Text>
              <Text style={styles.matchText}>{t('password.passwordMatch')}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title={t('common.next')}
            onPress={handleNext}
            disabled={!canProceed}
          />
        </View>
      </ScreenContainer>
    </View>
  );
});

SignUpPasswordScreen.displayName = 'SignUpPasswordScreen';

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
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  requirementsContainer: {
    marginBottom: SPACING.lg,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  indicator: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
    width: 16,
  },
  indicatorMet: {
    color: COLORS.text,
  },
  requirementText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
  },
  requirementMet: {
    color: COLORS.text,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  matchIndicator: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
    width: 16,
  },
  matchText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
  },
  footer: {
    paddingBottom: SPACING.lg,
  },
});
