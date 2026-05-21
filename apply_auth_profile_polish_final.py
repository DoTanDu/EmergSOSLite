from pathlib import Path
import json, shutil, os, re, textwrap
root = Path.cwd()

def write(rel, content):
    p = root/rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(textwrap.dedent(content).lstrip('\n'), encoding='utf-8')
    print('write', rel)

# Cleanup old helper scripts and backups
for name in ['fix-google-profile-text-inline.js','fix-vietnamese-text-v3.js','apply-profile-edit-avatar-inline.js','apply_google_profile_avatar_edit.ps1','final_fix_emergsos_lite.ps1','final_fix_emergsos_lite_v2.ps1']:
    p=root/name
    if p.exists():
        p.unlink()
for p in list(root.glob('backup_before_*')):
    if p.is_dir(): shutil.rmtree(p)
    else: p.unlink()

# package and appjson
pkg_path=root/'package.json'
pkg=json.loads(pkg_path.read_text(encoding='utf-8-sig'))
pkg.setdefault('scripts',{})
pkg['scripts'].update({
    'start':'expo start', 'start:clear':'expo start -c', 'android':'expo start --android', 'ios':'expo start --ios', 'web':'expo start --web', 'doctor':'expo-doctor'
})
pkg.setdefault('dependencies',{})
pkg['dependencies'].update({
    'expo-image-picker':'~17.0.11',
    'expo-web-browser':'~15.0.8'
})
pkg_path.write_text(json.dumps(pkg, ensure_ascii=False, indent=2)+'\n',encoding='utf-8')
print('write package.json')

app_path=root/'app.json'
app=json.loads(app_path.read_text(encoding='utf-8-sig'))
expo=app.setdefault('expo',{})
ios=expo.setdefault('ios',{})
info=ios.setdefault('infoPlist',{})
info['NSPhotoLibraryUsageDescription']='EmergSOS Lite cần quyền thư viện ảnh để cập nhật ảnh đại diện.'
info.setdefault('NSLocationWhenInUseUsageDescription','EmergSOS Lite cần vị trí để tạo cảnh báo SOS kèm link Google Maps.')
android=expo.setdefault('android',{})
android['permissions']=list(dict.fromkeys(android.get('permissions',[])+['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION','READ_MEDIA_IMAGES']))
plugins=expo.get('plugins',[])
expo['plugins']=list(dict.fromkeys(plugins+['expo-image-picker']))
expo.setdefault('web',{})['bundler']='metro'
app_path.write_text(json.dumps(app, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print('write app.json')

write('src/components/TextInputField.js', r'''
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

export default function TextInputField({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  containerStyle,
  inputStyle,
  editable = true,
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, !editable && styles.disabledWrap, error && styles.inputError]}>
        {leftIcon ? <Text style={styles.leftIcon}>{leftIcon}</Text> : null}
        <TextInput
          placeholderTextColor={colors.muted}
          style={[styles.input, !editable && styles.disabledInput, inputStyle]}
          editable={editable}
          {...props}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  label: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14
  },
  inputWrap: {
    minHeight: 52,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text
  },
  leftIcon: {
    marginRight: 8,
    fontSize: 17
  },
  rightElement: {
    marginLeft: 8
  },
  disabledWrap: {
    backgroundColor: '#F3F4F6'
  },
  disabledInput: {
    color: colors.muted
  },
  inputError: {
    borderColor: colors.danger
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700'
  }
});
''')

write('src/components/PrimaryButton.js', r'''
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle
}) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success';
  const isGhost = variant === 'ghost';
  const isDark = variant === 'dark';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isSuccess && styles.success,
        isGhost && styles.ghost,
        isDark && styles.dark,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.primary : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon ? <Text style={[styles.icon, (isOutline || isGhost) && styles.outlineText]}>{icon}</Text> : null}
          <Text style={[styles.text, (isOutline || isGhost) && styles.outlineText, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: colors.white,
    marginRight: 8,
    fontSize: 17
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0
  },
  ghost: {
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0,
    elevation: 0
  },
  danger: {
    backgroundColor: colors.danger
  },
  success: {
    backgroundColor: colors.success
  },
  dark: {
    backgroundColor: colors.text
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    transform: [{ scale: 0.985 }]
  },
  text: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16
  },
  outlineText: {
    color: colors.primary
  }
});
''')

write('src/constants/colors.js', r'''
export const colors = {
  primary: '#E53935',
  primaryDark: '#B71C1C',
  primaryLight: '#FFEBEE',
  secondary: '#1E88E5',
  secondaryLight: '#E3F2FD',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#F9A825',
  warningLight: '#FFF8E1',
  danger: '#C62828',
  dangerLight: '#FFEBEE',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000'
};
''')

write('src/services/authService.js', r'''
import { Platform } from 'react-native';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

function normalizeAuthError(error) {
  const code = error?.code || '';

  if (code.includes('auth/email-already-in-use')) return 'Email này đã được đăng ký.';
  if (code.includes('auth/invalid-email')) return 'Email không hợp lệ.';
  if (code.includes('auth/weak-password')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (code.includes('auth/user-not-found')) return 'Không tìm thấy tài khoản.';
  if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) return 'Email hoặc mật khẩu không đúng.';
  if (code.includes('auth/popup-closed-by-user')) return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  if (code.includes('auth/popup-blocked')) return 'Trình duyệt đang chặn popup Google. Hãy cho phép popup cho localhost.';
  if (code.includes('auth/operation-not-allowed')) return 'Firebase chưa bật phương thức đăng nhập Google.';

  return error?.message || 'Có lỗi Firebase Auth.';
}

async function saveUserProfile(user, extra = {}) {
  const payload = {
    uid: user.uid,
    fullName: extra.fullName || user.displayName || 'Người dùng',
    displayName: extra.fullName || user.displayName || 'Người dùng',
    email: user.email || '',
    phone: extra.phone || '',
    avatarUrl: extra.avatarUrl || user.photoURL || '',
    provider: extra.provider || 'password',
    updatedAt: serverTimestamp()
  };

  if (extra.createdAt) payload.createdAt = extra.createdAt;

  await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
}

export async function registerUser({ fullName, email, phone, password }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    await updateProfile(user, { displayName: fullName.trim() });

    await saveUserProfile(user, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      provider: 'password',
      createdAt: serverTimestamp()
    });

    return user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function loginUser({ email, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function loginWithGoogleWeb() {
  try {
    if (Platform.OS !== 'web') {
      throw new Error('Google Login bản hiện tại ưu tiên chạy trên web demo. Trên điện thoại cần cấu hình OAuth Client ID native.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const credential = await signInWithPopup(auth, provider);
    await saveUserProfile(credential.user, { provider: 'google' });

    return credential.user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, 'users', user.uid));
  const firestoreData = snap.exists() ? snap.data() : {};

  return {
    uid: user.uid,
    fullName: firestoreData.fullName || firestoreData.displayName || user.displayName || 'Người dùng',
    displayName: firestoreData.displayName || firestoreData.fullName || user.displayName || 'Người dùng',
    email: firestoreData.email || user.email || '',
    phone: firestoreData.phone || '',
    avatarUrl: firestoreData.avatarUrl || user.photoURL || '',
    provider: firestoreData.provider || (user.providerData?.[0]?.providerId || 'password')
  };
}

export async function updateUserProfile({ displayName, fullName, phone, avatarUrl }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Bạn chưa đăng nhập.');

  const name = (displayName || fullName || '').trim();
  if (!name) throw new Error('Tên hiển thị không được để trống.');

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName: name,
    displayName: name,
    email: user.email || '',
    phone: phone?.trim() || '',
    avatarUrl: avatarUrl || '',
    updatedAt: serverTimestamp()
  }, { merge: true });

  return getCurrentUserProfile();
}
''')

write('src/screens/LoginScreen.js', r'''
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { loginUser, loginWithGoogleWeb } from '../services/authService';
import { isValidEmail } from '../utils/validators';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('demo@gmail.com');
  const [password, setPassword] = useState('123456');
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
        <Text style={styles.heroText}>Đăng nhập để quản lý danh bạ khẩn cấp, gửi SOS kèm vị trí và theo dõi lịch sử cảnh báo.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đăng nhập</Text>
        <Text style={styles.cardSub}>Dùng tài khoản demo hoặc tài khoản đã đăng ký.</Text>

        <TextInputField
          label="Email"
          leftIcon="✉️"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          placeholder="demo@gmail.com"
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

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Tài khoản demo</Text>
          <Text style={styles.demoText}>Email: demo@gmail.com · Mật khẩu: 123456</Text>
        </View>
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  iconText: {
    color: colors.primary,
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
  heroText: {
    marginTop: 10,
    color: colors.white,
    opacity: 0.94,
    lineHeight: 21
  },
  card: {
    backgroundColor: colors.white,
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
  cardSub: {
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 2
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
  },
  demoBox: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 16,
    padding: 12
  },
  demoTitle: {
    color: colors.secondary,
    fontWeight: '900'
  },
  demoText: {
    color: colors.text,
    marginTop: 3,
    fontSize: 13
  }
});
''')

write('src/screens/RegisterScreen.js', r'''
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
''')

write('src/screens/ProfileScreen.js', r'''
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { getCurrentUserProfile, logoutUser, updateUserProfile } from '../services/authService';

async function convertAssetToStorableUri(asset) {
  if (!asset) return '';
  if (asset.base64) return `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
  return asset.uri || '';
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoadingProfile(true);
      const data = await getCurrentUserProfile();
      setProfile(data);
      setDisplayName(data?.displayName || data?.fullName || '');
      setPhone(data?.phone || '');
      setAvatarUri(data?.avatarUrl || auth.currentUser?.photoURL || '');
    } catch (error) {
      Alert.alert('Tải hồ sơ lỗi', error.message);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePickAvatar() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Thiếu quyền', 'Bạn cần cấp quyền thư viện ảnh để chọn ảnh đại diện.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.55,
        base64: Platform.OS === 'web'
      });

      if (!result.canceled && result.assets?.length) {
        const uri = await convertAssetToStorableUri(result.assets[0]);
        setAvatarUri(uri);
        setEditing(true);
      }
    } catch (error) {
      Alert.alert('Chọn ảnh lỗi', error.message);
    }
  }

  async function handleSave() {
    if (!displayName.trim()) {
      Alert.alert('Thiếu tên hiển thị', 'Tên hiển thị không được để trống.');
      return;
    }

    try {
      setLoading(true);
      const updated = await updateUserProfile({
        displayName,
        phone,
        avatarUrl: avatarUri
      });

      setProfile(updated);
      setEditing(false);
      Alert.alert('Đã lưu', 'Hồ sơ đã được cập nhật thành công.');
    } catch (error) {
      Alert.alert('Cập nhật lỗi', error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setDisplayName(profile?.displayName || profile?.fullName || '');
    setPhone(profile?.phone || '');
    setAvatarUri(profile?.avatarUrl || auth.currentUser?.photoURL || '');
    setEditing(false);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      Alert.alert('Đăng xuất lỗi', error.message);
    }
  }

  const providerText = profile?.provider?.includes('google')
    ? 'Google'
    : 'Email/Mật khẩu';

  const initial = (displayName || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Tài khoản cá nhân</Text>
          <Text style={styles.title}>Hồ sơ</Text>
        </View>
        <Pressable style={styles.refreshButton} onPress={loadProfile} disabled={loadingProfile}>
          <Text style={styles.refreshText}>{loadingProfile ? '...' : '↻'}</Text>
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar} activeOpacity={0.85}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraText}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{displayName || 'Người dùng'}</Text>
        <Text style={styles.email}>{profile?.email || auth.currentUser?.email || 'Chưa có email'}</Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{providerText}</Text>
          </View>
          <View style={[styles.pill, styles.safePill]}>
            <Text style={[styles.pillText, styles.safePillText]}>Đang hoạt động</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>Chỉnh sửa hồ sơ</Text>
            <Text style={styles.sectionSub}>Tên hiển thị, số điện thoại và ảnh đại diện.</Text>
          </View>
          {editing ? (
            <Pressable onPress={handleCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => setEditing(true)}>
              <Text style={styles.editLink}>Sửa</Text>
            </Pressable>
          )}
        </View>

        <TextInputField
          label="Tên hiển thị"
          leftIcon="👤"
          value={displayName}
          onChangeText={setDisplayName}
          editable={editing}
          placeholder="Nhập tên hiển thị"
        />

        <TextInputField
          label="Số điện thoại"
          leftIcon="📞"
          value={phone}
          onChangeText={setPhone}
          editable={editing}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />

        <TextInputField
          label="Email"
          leftIcon="✉️"
          value={profile?.email || auth.currentUser?.email || ''}
          editable={false}
          placeholder="Email tài khoản"
          hint="Email dùng để đăng nhập nên không sửa trực tiếp trong app demo."
        />

        <PrimaryButton title="Đổi ảnh đại diện" icon="🖼️" variant="ghost" onPress={handlePickAvatar} />

        {editing ? (
          <PrimaryButton title="Lưu thay đổi" icon="💾" onPress={handleSave} loading={loading} />
        ) : null}
      </View>

      <View style={styles.cardSmall}>
        <Text style={styles.sectionTitle}>Dữ liệu lưu ở đâu?</Text>
        <Text style={styles.sectionSub}>Thông tin hồ sơ được lưu trong Firestore collection users và đồng bộ với Firebase Auth displayName.</Text>
      </View>

      <PrimaryButton title="Đăng xuất" icon="🚪" variant="danger" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  kicker: {
    color: colors.white,
    opacity: 0.9,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  refreshText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900'
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 10
  },
  avatarWrap: {
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.background,
    borderWidth: 4,
    borderColor: colors.primaryLight
  },
  avatarFallback: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white
  },
  avatarText: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: '900'
  },
  cameraBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white
  },
  cameraText: {
    fontSize: 16
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center'
  },
  email: {
    color: colors.muted,
    textAlign: 'center'
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  pill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  pillText: {
    color: colors.secondary,
    fontWeight: '900',
    fontSize: 12
  },
  safePill: {
    backgroundColor: colors.successLight
  },
  safePillText: {
    color: colors.success
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  cardSmall: {
    backgroundColor: colors.warningLight,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text
  },
  sectionSub: {
    marginTop: 3,
    color: colors.muted,
    lineHeight: 19
  },
  editLink: {
    color: colors.primary,
    fontWeight: '900'
  },
  cancelText: {
    color: colors.muted,
    fontWeight: '900'
  }
});
''')

write('src/config/googleOAuth.js', r'''
export const googleOAuthConfig = {
  webClientId: '',
  androidClientId: '',
  iosClientId: ''
};

// Web demo dùng Firebase Google Popup, không cần Client ID trong file này.
// Muốn Google Login native trên Expo Go/điện thoại thì tạo OAuth Client ID rồi điền vào đây.
''')

write('docs/google-profile-setup.md', '''
# Google Login, avatar và chỉnh sửa hồ sơ

## Chức năng đã hoàn thiện

- Đăng nhập bằng Google trên web demo bằng Firebase Google Popup.
- Hồ sơ hiển thị ảnh đại diện, tên hiển thị, email, số điện thoại và kiểu đăng nhập.
- Người dùng có thể chọn ảnh đại diện từ thư viện ảnh.
- Người dùng có thể sửa tên hiển thị và số điện thoại.
- Dữ liệu được lưu vào Firestore collection `users`.
- Firebase Auth được cập nhật `displayName`.

## Cần bật trong Firebase Console

1. Vào Firebase Console.
2. Chọn project `emergsoslite`.
3. Vào Authentication > Sign-in method.
4. Bật provider Google.
5. Lưu lại.

## Demo

```bash
npx expo start -c
```

- Bấm `w` để demo trên web.
- Quét QR bằng Expo Go để demo trên điện thoại.
- Google Login hiện ưu tiên demo trên web.
''')
