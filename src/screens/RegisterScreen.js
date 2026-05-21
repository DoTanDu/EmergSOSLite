import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { registerUser } from '../services/authService';
import { colors } from '../constants/colors';
import { isValidEmail, isValidPhone } from '../utils/validators';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength = useMemo(() => {
    const value = form.password;
    let score = 0;
    if (value.length >= 6) score += 1;
    if (/[A-ZÀ-Ỵ]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9À-Ỵà-ỵ]/.test(value)) score += 1;
    return score;
  }, [form.password]);

  function setValue(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function normalizeEmail(value) {
    const trimmed = value.trim();
    if (trimmed && !trimmed.includes('@')) return `${trimmed}@gmail.com`;
    return trimmed;
  }

  function validate() {
    const finalEmail = normalizeEmail(form.email);
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Nhập họ tên của bạn.';
    if (!finalEmail) nextErrors.email = 'Nhập email.';
    else if (!isValidEmail(finalEmail)) nextErrors.email = 'Email không hợp lệ.';
    if (!isValidPhone(form.phone)) nextErrors.phone = 'Số điện thoại không hợp lệ.';
    if (form.password.length < 6) nextErrors.password = 'Mật khẩu tối thiểu 6 ký tự.';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Mật khẩu nhập lại chưa khớp.';

    setErrors(nextErrors);
    return { ok: Object.keys(nextErrors).length === 0, finalEmail };
  }

  async function handleRegister() {
    const { ok, finalEmail } = validate();
    if (!ok) return;

    try {
      setLoading(true);
      await registerUser({
        fullName: form.fullName.trim(),
        email: finalEmail,
        phone: form.phone.trim(),
        password: form.password
      });
    } catch (error) {
      Alert.alert('Đăng ký lỗi', error.message);
    } finally {
      setLoading(false);
    }
  }

  const strengthLabels = ['Rất yếu', 'Yếu', 'Ổn', 'Mạnh', 'Rất mạnh'];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.kicker}>Bắt đầu trong 30 giây</Text>
        <Text style={styles.title}>Tạo tài khoản an toàn</Text>
        <Text style={styles.subtitle}>Tài khoản dùng để lưu danh bạ khẩn cấp, lịch sử SOS và hồ sơ cá nhân của bạn.</Text>
      </View>

      <View style={styles.card}>
        <TextInputField
          label="Họ tên"
          leftIcon="👤"
          value={form.fullName}
          onChangeText={(value) => setValue('fullName', value)}
          error={errors.fullName}
          placeholder="Nguyễn Văn A"
        />

        <TextInputField
          label="Email"
          leftIcon="✉️"
          value={form.email}
          onChangeText={(value) => setValue('email', value)}
          error={errors.email}
          hint="Có thể nhập nhanh phần trước @gmail.com."
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@example.com"
        />

        <TextInputField
          label="Số điện thoại"
          leftIcon="📞"
          value={form.phone}
          onChangeText={(value) => setValue('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
          placeholder="09xxxxxxxx"
        />

        <TextInputField
          label="Mật khẩu"
          leftIcon="🔒"
          value={form.password}
          onChangeText={(value) => setValue('password', value)}
          error={errors.password}
          secureTextEntry={!showPassword}
          placeholder="Ít nhất 6 ký tự"
          rightElement={(
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
              <Text style={styles.toggle}>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
            </Pressable>
          )}
        />

        <View style={styles.strengthBox}>
          <View style={styles.strengthTrack}>
            {[0, 1, 2, 3].map((item) => (
              <View key={item} style={[styles.strengthSegment, item < passwordStrength && styles.strengthActive]} />
            ))}
          </View>
          <Text style={styles.strengthText}>Độ mạnh: {strengthLabels[passwordStrength]}</Text>
        </View>

        <TextInputField
          label="Nhập lại mật khẩu"
          leftIcon="✅"
          value={form.confirmPassword}
          onChangeText={(value) => setValue('confirmPassword', value)}
          error={errors.confirmPassword}
          secureTextEntry={!showPassword}
          placeholder="Nhập lại mật khẩu"
        />

        <PrimaryButton title="Tạo tài khoản" icon="✨" onPress={handleRegister} loading={loading} />
        <PrimaryButton title="Quay lại đăng nhập" variant="outline" onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.text,
    borderRadius: 28,
    padding: 22
  },
  kicker: {
    color: colors.primaryLight,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    color: colors.white
  },
  subtitle: {
    marginTop: 8,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  toggle: {
    color: colors.primary,
    fontWeight: '900'
  },
  strengthBox: {
    gap: 6
  },
  strengthTrack: {
    flexDirection: 'row',
    gap: 6
  },
  strengthSegment: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.border
  },
  strengthActive: {
    backgroundColor: colors.primary
  },
  strengthText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  }
});
