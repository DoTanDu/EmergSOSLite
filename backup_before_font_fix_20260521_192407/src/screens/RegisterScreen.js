import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { registerUser } from '../services/authService';
import { colors } from '../constants/colors';
import { isValidEmail, isValidPhone } from '../utils/validators';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  function setValue(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRegister() {
    if (!form.fullName.trim()) return Alert.alert('Lá»—i', 'Nháº­p há» tÃªn.');
    if (!isValidEmail(form.email)) return Alert.alert('Lá»—i', 'Email khÃ´ng há»£p lá»‡.');
    if (!isValidPhone(form.phone)) return Alert.alert('Lá»—i', 'Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡.');
    if (form.password.length < 6) return Alert.alert('Lá»—i', 'Máº­t kháº©u tá»‘i thiá»ƒu 6 kÃ½ tá»±.');

    try {
      setLoading(true);
      await registerUser(form);
    } catch (error) {
      Alert.alert('ÄÄƒng kÃ½ lá»—i', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Táº¡o tÃ i khoáº£n</Text>
      <Text style={styles.subtitle}>ThÃ´ng tin nÃ y dÃ¹ng Ä‘á»ƒ lÆ°u danh báº¡ vÃ  lá»‹ch sá»­ SOS theo tá»«ng ngÆ°á»i dÃ¹ng.</Text>

      <TextInputField label="Há» tÃªn" value={form.fullName} onChangeText={(v) => setValue('fullName', v)} placeholder="Nguyá»…n VÄƒn A" />
      <TextInputField label="Email" value={form.email} onChangeText={(v) => setValue('email', v)} autoCapitalize="none" keyboardType="email-address" placeholder="email@example.com" />
      <TextInputField label="Sá»‘ Ä‘iá»‡n thoáº¡i" value={form.phone} onChangeText={(v) => setValue('phone', v)} keyboardType="phone-pad" placeholder="09xxxxxxxx" />
      <TextInputField label="Máº­t kháº©u" value={form.password} onChangeText={(v) => setValue('password', v)} secureTextEntry placeholder="Ãt nháº¥t 6 kÃ½ tá»±" />

      <PrimaryButton title="ÄÄƒng kÃ½" onPress={handleRegister} loading={loading} />
      <PrimaryButton title="Quay láº¡i Ä‘Äƒng nháº­p" variant="outline" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 22,
    fontSize: 30,
    fontWeight: '900',
    color: colors.text
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20
  }
});

