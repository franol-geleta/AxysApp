import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button, Input, Header, ScreenContainer } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpAddress'>;

interface Props {
  navigation: NavigationProp;
}

const COUNTRIES = [
  { code: 'US', name: 'United States of America', nameJa: 'アメリカ合衆国' },
  { code: 'GB', name: 'United Kingdom', nameJa: 'イギリス' },
  { code: 'AU', name: 'Australia', nameJa: 'オーストラリア' },
  { code: 'DE', name: 'Germany', nameJa: 'ドイツ' },
  { code: 'FR', name: 'France', nameJa: 'フランス' },
  { code: 'JP', name: 'Japan', nameJa: '日本' },
];

export const SignUpAddressScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { signUpData, updateSignUpData } = useSignUp();
  const [country, setCountry] = useState(signUpData.country);
  const [address, setAddress] = useState(signUpData.address);
  const [city, setCity] = useState(signUpData.city);
  const [postalCode, setPostalCode] = useState(signUpData.postalCode);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isJapanese = i18n.language === 'ja';
  const canProceed = country && address && city && postalCode;

  const filteredCountries = COUNTRIES.filter((c) => {
    const name = isJapanese ? c.nameJa : c.name;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedCountryName = country
    ? COUNTRIES.find((c) => c.code === country)?.[isJapanese ? 'nameJa' : 'name']
    : '';

  const handleNext = () => {
    updateSignUpData({ country, address, city, postalCode });
    navigation.navigate('SignUpPassword');
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} showProgress progress={60} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('address.title')}</Text>

          <TouchableOpacity onPress={() => setShowCountryModal(true)}>
            <Input
              label={t('address.selectCountry')}
              value={selectedCountryName}
              editable={false}
              pointerEvents="none"
              rightIcon={<Text style={styles.dropdownIcon}>▼</Text>}
            />
          </TouchableOpacity>

          <Input
            label={t('address.addressLine')}
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
          />

          <Input
            label={t('address.city')}
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <Input
            label={t('address.postalCode')}
            value={postalCode}
            onChangeText={setPostalCode}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.footer}>
          <Button
            title={t('common.next')}
            onPress={handleNext}
            disabled={!canProceed}
          />
        </View>
      </ScreenContainer>

      {/* Country Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('address.selectCountry')}</Text>

            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountry(item.code);
                    setShowCountryModal(false);
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.countryText}>
                    {isJapanese ? item.nameJa : item.name}
                  </Text>
                  {country === item.code && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: SPACING.xl,
  },
  dropdownIcon: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    paddingBottom: SPACING.lg,
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
    fontWeight: '600',
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
  countryText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
  },
});
