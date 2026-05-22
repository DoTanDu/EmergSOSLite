import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import SosButton from '../components/SosButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { getCurrentLocation } from '../services/locationService';
import { createSosEvent, sendSosSms, createSosMessage } from '../services/sosService';
import { getContactsByUser } from '../services/contactService';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleSosTrigger() {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Lỗi', 'Bạn cần đăng nhập trước khi SOS.');

    try {
      setLoading(true);

      // 1. Lấy vị trí GPS (vẫn lấy được kể cả khi không có mạng internet, chỉ cần bật GPS)
      const location = await getCurrentLocation();
      
      // Tạo sẵn message offline phòng hờ rớt mạng
      const offlineMessage = createSosMessage(location);
      let event = { message: offlineMessage, latitude: location.latitude, longitude: location.longitude, status: 'active' };

      // 2. Thử lưu lên Firebase Database
      try {
        event = await createSosEvent(user.uid, location);
      } catch (firebaseError) {
        console.warn('Lỗi Firebase (có thể do rớt mạng):', firebaseError.message);
        Alert.alert('Chế độ Offline', 'Không có kết nối mạng để lưu lên hệ thống. App vẫn sẽ mở tin nhắn SMS để gửi vị trí!');
      }

      // 3. Lấy danh bạ và Tự động gửi SMS (luôn chạy dù Firebase thành công hay thất bại)
      try {
        const contacts = await getContactsByUser(user.uid);
        const phones = contacts.map((c) => c.phone).filter(Boolean);

        if (phones.length > 0) {
          await sendSosSms(phones, event.message);
        }
      } catch (smsError) {
        console.warn('Gửi SMS tự động lỗi:', smsError.message);
      }

      // 4. Chuyển sang màn hình cảnh báo (Đổi Date thành chuỗi để tránh cảnh báo React Navigation)
      const serializableEvent = {
        ...event,
        createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt
      };
      navigation.navigate('SosAlert', { event: serializableEvent });
    } catch (error) {
      Alert.alert('Không thể kích hoạt SOS', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.hello}>EmergSOS Lite</Text>
        <Text style={styles.title}>Nhấn giữ SOS 3 giây</Text>
      </View>

      <SosButton onTrigger={handleSosTrigger} disabled={loading} />

      <View style={styles.grid}>
        <PrimaryButton title="Danh bạ khẩn cấp" onPress={() => navigation.navigate('Contacts')} style={styles.gridButton} />
        <PrimaryButton title="Lịch sử SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} style={styles.gridButton} />
        <PrimaryButton title="Fake Call" variant="outline" onPress={() => navigation.navigate('FakeCall')} style={styles.gridButton} />
        <PrimaryButton title="Điểm nguy hiểm" variant="outline" onPress={() => navigation.navigate('DangerMap')} style={styles.gridButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171A23'
  },
  topCard: {
    backgroundColor: '#101828',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A3142'
  },
  hello: {
    color: '#98A2B3',
    fontWeight: '700'
  },
  title: {
    marginTop: 6,
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900'
  },
  grid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  gridButton: {
    flexGrow: 1,
    minWidth: '47%'
  }
});
