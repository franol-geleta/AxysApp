import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { Button, Input, Header, ScreenContainer, CalendarPicker } from '../../components/common';
import { useSignUp } from '../../context/SignUpContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpPersonalInfo'>;

interface Props {
  navigation: NavigationProp;
}

const COUNTRIES = [
  { code: 'US', name: 'United States of America', nameJa: 'アメリカ合衆国' },
  { code: 'GB', name: 'United Kingdom', nameJa: 'イギリス' },
  { code: 'AU', name: 'Australia', nameJa: 'オーストラリア' },
  { code: 'DE', name: 'Germany', nameJa: 'ドイツ' },
  { code: 'FR', name: 'France', nameJa: 'フランス' },
  { code: 'ES', name: 'Spain', nameJa: 'スペイン' },
  { code: 'HU', name: 'Hungary', nameJa: 'ハンガリー' },
  { code: 'IT', name: 'Italy', nameJa: 'イタリア' },
  { code: 'RO', name: 'Romania', nameJa: 'ルーマニア' },
  { code: 'CH', name: 'Switzerland', nameJa: 'スイス' },
  { code: 'AT', name: 'Austria', nameJa: 'オーストリア' },
  { code: 'JP', name: 'Japan', nameJa: '日本' },
];

export const SignUpPersonalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { signUpData, updateSignUpData } = useSignUp();
  const [firstName, setFirstName] = useState(signUpData.firstName);
  const [middleName, setMiddleName] = useState(signUpData.middleName);
  const [lastName, setLastName] = useState(signUpData.lastName);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [nationality, setNationality] = useState(signUpData.nationality);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNationalityModal, setShowNationalityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isJapanese = i18n.language === 'ja';

  const canProceed = firstName && lastName && dateOfBirth && nationality;

  const filteredCountries = COUNTRIES.filter((country) => {
    const name = isJapanese ? country.nameJa : country.name;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleNext = () => {
    updateSignUpData({
      firstName,
      middleName,
      lastName,
      dateOfBirth: dateOfBirth?.toISOString() || '',
      nationality,
    });
    navigation.navigate('SignUpPEP');
  };

  const selectedCountryName = nationality
    ? COUNTRIES.find((c) => c.code === nationality)?.[isJapanese ? 'nameJa' : 'name']
    : '';

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} showProgress progress={40} />

      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>{t('personalInfo.title')}</Text>

          <Input
            label={t('personalInfo.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Input
            label={t('personalInfo.middleName')}
            value={middleName}
            onChangeText={setMiddleName}
            autoCapitalize="words"
          />

          <Input
            label={t('personalInfo.lastName')}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Input
              label={t('personalInfo.dateOfBirth')}
              value={dateOfBirth ? formatDate(dateOfBirth) : ''}
              editable={false}
              pointerEvents="none"
              rightIcon={<Text style={styles.calendarIcon}>📅</Text>}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowNationalityModal(true)}>
            <Input
              label={t('personalInfo.nationality')}
              value={selectedCountryName}
              editable={false}
              pointerEvents="none"
              rightIcon={<Text style={styles.dropdownIcon}>▼</Text>}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('common.next')}
            onPress={handleNext}
            disabled={!canProceed}
          />
        </View>
      </ScreenContainer>

      {/* Date Picker */}
      <CalendarPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(date) => {
          setDateOfBirth(date);
          setShowDatePicker(false);
        }}
        selectedDate={dateOfBirth}
        maxDate={new Date()}
        minDate={new Date(1900, 0, 1)}
      />

      {/* Nationality Modal */}
      <Modal
        visible={showNationalityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNationalityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('personalInfo.nationality')}</Text>

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
                    setNationality(item.code);
                    setShowNationalityModal(false);
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.countryText}>
                    {isJapanese ? item.nameJa : item.name}
                  </Text>
                  {nationality === item.code && (
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
  footer: {
    paddingBottom: SPACING.lg,
  },
  calendarIcon: {
    fontSize: FONT_SIZES.lg,
  },
  dropdownIcon: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
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
