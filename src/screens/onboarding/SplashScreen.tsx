import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoading, isAuthenticated, hasCompletedOnboarding, hasBiometricsSetup, hasPinSetup } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated && hasCompletedOnboarding) {
        // User is logged in, go to resume flow
        if (hasBiometricsSetup || hasPinSetup) {
          navigation.replace('ResumeWelcome');
        } else {
          navigation.replace('Dashboard');
        }
      } else {
        // New user or logged out, go to welcome
        navigation.replace('Welcome');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, hasCompletedOnboarding, hasBiometricsSetup, hasPinSetup, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/axys-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 90,
  },
});
