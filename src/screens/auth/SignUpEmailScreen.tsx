import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONTS } from '../../constants/theme';
import type { RootStackParamList } from '../../types';
import { Button, Input, Header, ScreenContainer } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpEmail'>;
type AuthTab = 'email' | 'phone';

interface Props {
  navigation: NavigationProp;
}

interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRY_CODES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
];

const TERMS_TEXT = `Terms of Service

Last updated: January 2024

1. Acceptance of Terms

By accessing and using the Axys application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

2. Description of Service

Axys provides a mobile application for financial management and related services. The service includes account management, transaction processing, and financial analytics.

3. User Responsibilities

You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.

4. Privacy Policy

Your use of Axys is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.

5. Electronic Communications

When you use Axys or send emails to us, you are communicating with us electronically. You consent to receive communications from us electronically.

6. User Content

You retain ownership of any content you submit through the application. By submitting content, you grant Axys a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content.

7. Prohibited Activities

You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.

8. Termination

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

9. Limitation of Liability

In no event shall Axys, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.

10. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.

11. Contact Information

If you have any questions about these Terms, please contact us at support@axys.com.

By using Axys, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_LENGTH = 7;
const SCROLL_THRESHOLD = 20;

export const SignUpEmailScreen: React.FC<Props> = memo(({ navigation }) => {
  const { t } = useTranslation();
  const { signUpData, updateSignUpData } = useSignUp();

  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [email, setEmail] = useState(signUpData.email);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isValidPhone = useMemo(() => phoneNumber.length >= MIN_PHONE_LENGTH, [phoneNumber]);

  const canProceed = useMemo(() => {
    const hasValidIdentifier = activeTab === 'email' ? isValidEmail : isValidPhone;
    return hasValidIdentifier && agreeToTerms;
  }, [activeTab, isValidEmail, isValidPhone, agreeToTerms]);

  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return COUNTRY_CODES.filter(country =>
      country.name.toLowerCase().includes(query) || country.dialCode.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleNext = useCallback(() => {
    if (activeTab === 'email') {
      updateSignUpData({ email });
      navigation.navigate('SignUpOTP', { email });
    } else {
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber}`;
      updateSignUpData({ phone: fullPhone });
      navigation.navigate('SignUpPhoneOTP', { phone: fullPhone });
    }
  }, [activeTab, email, selectedCountry, phoneNumber, updateSignUpData, navigation]);

  const handleTermsPress = useCallback(() => {
    setHasScrolledToEnd(false);
    setShowTermsModal(true);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - SCROLL_THRESHOLD;

    if (isAtBottom) {
      setHasScrolledToEnd(true);
    }
  }, []);

  const handleAgree = useCallback(() => {
    setAgreeToTerms(true);
    setShowTermsModal(false);
  }, []);

  const handleCloseTermsModal = useCallback(() => setShowTermsModal(false), []);
  const handleCloseCountryModal = useCallback(() => setShowCountryModal(false), []);
  const handleOpenCountryModal = useCallback(() => setShowCountryModal(true), []);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const selectEmailTab = useCallback(() => setActiveTab('email'), []);
  const selectPhoneTab = useCallback(() => setActiveTab('phone'), []);

  const formatPhoneNumber = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  }, []);

  const handleSelectCountry = useCallback((country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    setSearchQuery('');
  }, []);

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} showProgress progress={10} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('signUp.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('signUp.tagline')}</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.tabActive]}
              onPress={selectEmailTab}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
                {t('signUp.email')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.tabActive]}
              onPress={selectPhoneTab}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.tabTextActive]}>
                {t('signUp.phone')}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'email' ? (
            <Input
              label={t('signUp.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="email@example.com"
            />
          ) : (
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={handleOpenCountryModal}
              >
                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>

              <View style={styles.phoneInputWrapper}>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={formatPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="000 000 0000"
                  placeholderTextColor={COLORS.textSecondary}
                  maxLength={15}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleTermsPress}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              {t('signUp.termsAgreement')}{' '}
              <Text style={styles.link}>{t('signUp.termsOfService')}</Text>
              {' '}{t('signUp.and')}{' '}
              <Text style={styles.link}>{t('signUp.privacyPolicy')}</Text>.
            </Text>
          </TouchableOpacity>

          <Button
            title={t('common.next')}
            onPress={handleNext}
            disabled={!canProceed}
          />
        </View>
      </ScreenContainer>

      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseTermsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('signUp.termsTitle')}</Text>
            <TouchableOpacity onPress={handleCloseTermsModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
          >
            <Text style={styles.modalTermsText}>{TERMS_TEXT}</Text>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title={t('common.agree')}
              onPress={handleAgree}
              disabled={!hasScrolledToEnd}
            />
            {!hasScrolledToEnd && (
              <Text style={styles.scrollHint}>{t('signUp.scrollToAgree')}</Text>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseCountryModal}
      >
        <View style={styles.countryModalOverlay}>
          <View style={styles.countryModalContent}>
            <View style={styles.countryModalHandle} />
            <Text style={styles.countryModalTitle}>{t('phone.selectCountry')}</Text>

            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(item)}
                >
                  <View style={styles.countryItemLeft}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                  </View>
                  <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

SignUpEmailScreen.displayName = 'SignUpEmailScreen';

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
  phoneInputContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  dropdownIcon: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    marginLeft: SPACING.xs,
  },
  phoneInputWrapper: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  phoneInput: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  footer: {
    paddingBottom: SPACING.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.background,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  link: {
    color: COLORS.text,
    textDecorationLine: 'underline',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  modalTermsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
    paddingVertical: SPACING.lg,
  },
  modalFooter: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scrollHint: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  // Country Modal styles
  countryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  countryModalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '70%',
  },
  countryModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  countryModalTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.semiBold,
    marginBottom: SPACING.lg,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  countryDialCode: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
});
