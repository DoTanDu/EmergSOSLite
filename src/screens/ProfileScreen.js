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
