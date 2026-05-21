import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import {
  createSafeMessage,
  markSosAsSafe,
  sendSosSms,
  shareSosMessage
} from '../services/sosService';
import { getContactsByUser } from '../services/contactService';

export default function SosAlertScreen({ navigation, route }) {
  const event = route.params?.event;
  const [status, setStatus] = useState(event?.status || 'active');
  const [loading, setLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  if (!event) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>Không có dữ liệu SOS.</Text>
        <PrimaryButton title="Quay về trang chủ" onPress={() => navigation.navigate('Home')} />
      </ScreenContainer>
    );
  }

  async function getContactPhones() {
    const contacts = await getContactsByUser(event.userId);
    return contacts.map((contact) => contact.phone).filter(Boolean);
  }

  async function handleShare() {
    try {
      await shareSosMessage(event.message);
    } catch (error) {
      Alert.alert('Không thể chia sẻ', error.message);
    }
  }

  async function handleSms() {
    try {
      setSmsLoading(true);
      const phones = await getContactPhones();
      await sendSosSms(phones, event.message);
    } catch (error) {
      Alert.alert('Không thể gửi SMS', error.message);
    } finally {
      setSmsLoading(false);
    }
  }

  async function handleSafe() {
    if (!event.id) {
      Alert.alert('Thiếu dữ liệu', 'Không tìm thấy ID sự kiện SOS để cập nhật.');
      return;
    }

    try {
      setLoading(true);

      await markSosAsSafe(event.id);
      setStatus('safe');

      const phones = await getContactPhones();
      const safeMessage = createSafeMessage(event);
      await sendSosSms(phones, safeMessage);

      Alert.alert(
        'Đã cập nhật an toàn',
        phones.length > 0
          ? 'App đã mở tin nhắn thông báo an toàn cho danh bạ. Bạn chỉ cần bấm gửi trong ứng dụng tin nhắn.'
          : 'Không có số điện thoại trong danh bạ, app đã mở share sheet để chia sẻ thông báo an toàn.'
      );
    } catch (error) {
      Alert.alert('Cập nhật thất bại', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.alertBox}>
        <Text style={styles.badge}>{status === 'active' ? 'ĐANG SOS' : 'ĐÃ AN TOÀN'}</Text>
        <Text style={styles.title}>Cảnh báo đã được tạo</Text>
        <Text style={styles.subtitle}>Kiểm tra nội dung bên dưới rồi bấm chia sẻ qua Zalo/Messenger/SMS/Gmail.</Text>
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message}>{event.message}</Text>
      </View>

      <PrimaryButton title="Chia sẻ cảnh báo" onPress={handleShare} />
      <PrimaryButton title="Gửi SMS cho danh bạ" variant="outline" onPress={handleSms} loading={smsLoading} />
      {status === 'active' ? (
        <PrimaryButton title="Tôi đã an toàn" variant="success" onPress={handleSafe} loading={loading} />
      ) : null}
      <Text style={styles.safeNote}>
        Khi bấm “Tôi đã an toàn”, app sẽ cập nhật trạng thái và mở tin nhắn thông báo an toàn cho danh bạ khẩn cấp.
      </Text>
      <PrimaryButton title="Xem lịch sử SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    color: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '900',
    overflow: 'hidden'
  },
  title: {
    marginTop: 12,
    color: colors.white,
    fontSize: 26,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 8,
    color: colors.white,
    lineHeight: 20,
    opacity: 0.95
  },
  messageBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  message: {
    color: colors.text,
    lineHeight: 22,
    fontSize: 15
  },
  safeNote: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center'
  },
  empty: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border
  }
});