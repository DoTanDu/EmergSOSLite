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
    let finalEmail = form.email.trim();
    if (!finalEmail.includes('@') && finalEmail.length > 0) {
      finalEmail += '@gmail.com';
    }

    if (!form.fullName.trim()) return Alert.alert('Lỗi', 'Nhập họ tên.');
    if (!isValidEmail(finalEmail)) return Alert.alert('Lỗi', 'Email không hợp lệ.');
    if (!isValidPhone(form.phone)) return Alert.alert('Lỗi', 'Số điện thoại không hợp lệ.');
    if (form.password.length < 6) return Alert.alert('Lỗi', 'Mật khẩu tối thiểu 6 ký tự.');

    try {
      setLoading(true);
      await registerUser({ ...form, email: finalEmail });
    } catch (error) {
      Alert.alert('Đăng ký lỗi', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <Text style={styles.subtitle}>Thông tin này dùng để lưu danh bạ và lịch sử SOS theo từng người dùng.</Text>

      <TextInputField label="Họ tên" value={form.fullName} onChangeText={(v) => setValue('fullName', v)} placeholder="Nguyễn Văn A" />
      <TextInputField label="Email" value={form.email} onChangeText={(v) => setValue('email', v)} autoCapitalize="none" keyboardType="email-address" placeholder="email@example.com" />
      <TextInputField label="Số điện thoại" value={form.phone} onChangeText={(v) => setValue('phone', v)} keyboardType="phone-pad" placeholder="09xxxxxxxx" />
      <TextInputField label="Mật khẩu" value={form.password} onChangeText={(v) => setValue('password', v)} secureTextEntry placeholder="Ít nhất 6 ký tự" />

      <PrimaryButton title="Đăng ký" onPress={handleRegister} loading={loading} />
      <PrimaryButton title="Quay lại đăng nhập" variant="outline" onPress={() => navigation.goBack()} />
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
