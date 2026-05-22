import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { loginUser, loginWithGoogleWeb } from '../services/authService';
import { isValidEmail } from '../utils/validators';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function normalizeEmail(value) {
    const trimmed = value.trim();
    if (trimmed && !trimmed.includes('@')) return `${trimmed}@gmail.com`;
    return trimmed;
  }

  function validate() {
    const finalEmail = normalizeEmail(email);
    const nextErrors = {};

    if (!finalEmail) nextErrors.email = 'Nhập email để đăng nhập.';
    else if (!isValidEmail(finalEmail)) nextErrors.email = 'Email không hợp lệ.';

    if (!password) nextErrors.password = 'Nhập mật khẩu.';
    else if (password.length < 6) nextErrors.password = 'Mật khẩu tối thiểu 6 ký tự.';

    setErrors(nextErrors);
    return { ok: Object.keys(nextErrors).length === 0, finalEmail };
  }

  async function handleLogin() {
    const { ok, finalEmail } = validate();
    if (!ok) return;

    try {
      setLoading(true);
      await loginUser({ email: finalEmail, password });
    } catch (error) {
      Alert.alert('Đăng nhập lỗi', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Google Login trên điện thoại',
        'Bản hiện tại ưu tiên Google Login trên web demo. Trên Expo Go/điện thoại cần cấu hình OAuth Client ID native.'
      );
      return;
    }

    try {
      setGoogleLoading(true);
      await loginWithGoogleWeb();
    } catch (error) {
      Alert.alert('Đăng nhập Google lỗi', error.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>SOS</Text>
        </View>
        <Text style={styles.appName}>EmergSOS Lite</Text>
        <Text style={styles.heroTitle}>An toàn cá nhân trong một nút bấm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đăng nhập</Text>

        <TextInputField
          label="Email"
          leftIcon="✉️"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInputField
          label="Mật khẩu"
          leftIcon="🔒"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          rightElement={(
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
              <Text style={styles.toggle}>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
            </Pressable>
          )}
        />

        <PrimaryButton title="Đăng nhập" icon="🚀" onPress={handleLogin} loading={loading} />
        <PrimaryButton title="Đăng nhập bằng Google" icon="G" variant="outline" onPress={handleGoogleLogin} loading={googleLoading} />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.divider} />
        </View>

        <PrimaryButton title="Tạo tài khoản mới" variant="ghost" onPress={() => navigation.navigate('Register')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 24,
    overflow: 'hidden'
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  iconText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900'
  },
  appName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    opacity: 0.95
  },
  heroTitle: {
    marginTop: 6,
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900'
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text
  },
  toggle: {
    color: colors.primary,
    fontWeight: '900'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  }
});
