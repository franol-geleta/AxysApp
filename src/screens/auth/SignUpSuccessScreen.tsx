import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpSuccess'>;

interface Props {
  navigation: NavigationProp;
}

export const SignUpSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleContinue = () => {
    navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            <Text style={styles.checkEmoji}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>{t('pin.success')}</Text>
        <Text style={styles.subtitle}>{t('pin.successSubtitle')}</Text>
      </View>

      <View style={styles.footer}>
        <Button title={t('common.button')} onPress={handleContinue} />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  checkIcon: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: {
    fontSize: 48,
    color: COLORS.text,
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
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});
