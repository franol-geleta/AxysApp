import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: NavigationProp;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/axys-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>{t('dashboard.welcome')}</Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Account Status</Text>
            <Text style={styles.statValue}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Security</Text>
            <Text style={styles.statValue}>PIN + Biometrics</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Sign Out" onPress={handleSignOut} variant="secondary" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: {
    width: 100,
    height: 45,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  welcomeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  welcomeTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  userName: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  statsContainer: {
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  statValue: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});
