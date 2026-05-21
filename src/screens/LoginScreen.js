import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { loginUser } from '../services/authService';
import { colors } from '../constants/colors';
import { appText } from '../constants/appText';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Thiếu thông tin', 'Nhập email và mật khẩu trước đã.');
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email, password });
    } catch (error) {
      Alert.alert('Đăng nhập lỗi', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{appText.appName}</Text>
        <Text style={styles.subtitle}>Đăng nhập để quản lý SOS, danh bạ và lịch sử cảnh báo.</Text>
      </View>

      <TextInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="demo@email.com"
      />
      <TextInputField
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      <PrimaryButton title="Đăng nhập" onPress={handleLogin} loading={loading} />
      <PrimaryButton title="Tạo tài khoản mới" variant="outline" onPress={() => navigation.navigate('Register')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 42,
    marginBottom: 12
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    lineHeight: 20
  }
});
