import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button, Header } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpTerms'>;

interface Props {
  navigation: NavigationProp;
}

const TERMS_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

export const SignUpTermsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { signUpData } = useSignUp();

  const handleAgree = () => {
    navigation.navigate('SignUpOTP', { email: signUpData.email });
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} showProgress progress={15} />

      <View style={styles.content}>
        <Text style={styles.screenTitle}>{t('signUp.createAccount')}</Text>

        <View style={styles.termsCard}>
          <Text style={styles.termsTitle}>{t('signUp.termsTitle')}</Text>
          <ScrollView style={styles.termsScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.termsText}>{TERMS_TEXT}</Text>
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title={t('common.agree')} onPress={handleAgree} />
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
    paddingTop: SPACING.lg,
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  termsCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  termsTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  termsScroll: {
    flex: 1,
  },
  termsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
});
