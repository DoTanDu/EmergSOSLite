import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { getCurrentUserProfile, logoutUser } from '../services/authService';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getCurrentUserProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      Alert.alert('Đăng xuất lỗi', error.message);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Hồ sơ</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{profile?.fullName || 'Người dùng'}</Text>
        <Text style={styles.meta}>{profile?.email || 'Chưa tải email'}</Text>
        <Text style={styles.meta}>{profile?.phone || 'Chưa có số điện thoại'}</Text>
      </View>
      <PrimaryButton title="Đăng xuất" variant="danger" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  meta: {
    marginTop: 5,
    color: colors.muted
  }
});
