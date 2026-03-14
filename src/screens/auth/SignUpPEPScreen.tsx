import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button, Header, ScreenContainer } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpPEP'>;

interface Props {
  navigation: NavigationProp;
}

export const SignUpPEPScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { signUpData, updateSignUpData } = useSignUp();
  const [isPEP, setIsPEP] = useState<boolean | null>(signUpData.isPEP);

  const canProceed = isPEP !== null;

  const handleNext = () => {
    updateSignUpData({ isPEP: isPEP || false });
    navigation.navigate('SignUpAddress');
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} showProgress progress={50} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('personalInfo.title')}</Text>
          <Text style={styles.question}>{t('pep.question')}</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.option, isPEP === true && styles.optionSelected]}
              onPress={() => setIsPEP(true)}
            >
              <View style={[styles.radio, isPEP === true && styles.radioSelected]}>
                {isPEP === true && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>{t('common.yes')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, isPEP === false && styles.optionSelected]}
              onPress={() => setIsPEP(false)}
            >
              <View style={[styles.radio, isPEP === false && styles.radioSelected]}>
                {isPEP === false && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>{t('common.no')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>ℹ</Text>
          </View>
          <Text style={styles.infoText}>{t('pep.info')}</Text>
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
};

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
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  question: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionSelected: {
    borderColor: COLORS.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  infoIconText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  infoText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: SPACING.lg,
  },
});
