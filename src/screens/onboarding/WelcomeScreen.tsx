import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONTS } from '../../constants/theme';
import type { RootStackParamList, Language } from '../../types';
import { Button, Input } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: NavigationProp;
}

interface LanguageOption {
  code: Language;
  name: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
];

export const WelcomeScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLanguageSelect = useCallback((lang: Language) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  }, [setLanguage]);

  const handleOpenLanguageModal = useCallback(() => setShowLanguageModal(true), []);
  const handleCloseLanguageModal = useCallback(() => setShowLanguageModal(false), []);
  const handleNavigateToSignUp = useCallback(() => navigation.navigate('SignUpEmail'), [navigation]);
  const handleNavigateToLogin = useCallback(() => navigation.navigate('Login'), [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/globe-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/axys-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.languageButton}
              onPress={handleOpenLanguageModal}
            >
              <Text style={styles.languageIcon}>🌐</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          <View style={styles.bottomSection}>
            <Text style={styles.title}>{t('welcome.title')}</Text>
            <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>

            <View style={styles.buttonContainer}>
              <Button
                title={t('welcome.getStarted')}
                onPress={handleNavigateToSignUp}
                variant="primary"
              />
              <Button
                title={t('welcome.logIn')}
                onPress={handleNavigateToLogin}
                variant="secondary"
                style={styles.loginButton}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseLanguageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('languages.title')}</Text>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Input
                placeholder={t('common.search')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                containerStyle={styles.searchInputContainer}
              />
            </View>

            <FlatList
              data={filteredLanguages}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text style={styles.languageItemText}>{item.name}</Text>
                  {language === item.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: {
    width: 100,
    height: 45,
  },
  languageButton: {
    padding: SPACING.sm,
  },
  languageIcon: {
    fontSize: FONT_SIZES.xl,
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxxl,
    fontFamily: FONTS.regular,
  },
  subtitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxxl,
    fontFamily: FONTS.semiBold,
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  loginButton: {
    backgroundColor: COLORS.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.semiBold,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  searchIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  languageItemText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
  },
});
