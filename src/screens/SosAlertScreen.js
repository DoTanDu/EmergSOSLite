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
import { getAmbientRecordingState, stopAmbientRecording } from '../services/ambientRecordingService';

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
      let recordingStopped = false;
      let recordingUri = '';

      if (getAmbientRecordingState().isRecording) {
        try {
          const recordingResult = await stopAmbientRecording();
          recordingStopped = true;
          recordingUri = recordingResult.lastRecordingUri || '';
        } catch (recordingError) {
          console.warn('Dừng ghi âm môi trường lỗi:', recordingError.message);
        }
      }

      const phones = await getContactPhones();
      const safeMessage = createSafeMessage(event);
      await sendSosSms(phones, safeMessage);

      Alert.alert(
        'Đã cập nhật an toàn',
        `${phones.length > 0
          ? 'Đã mở màn hình nhắn tin để gửi thông báo an toàn.'
          : 'Không có số trong danh bạ, đã mở chia sẻ để gửi thông báo an toàn.'}${
          recordingStopped
            ? recordingUri
              ? `\nĐã dừng ghi âm môi trường.\nFile: ${recordingUri}`
              : '\nĐã dừng ghi âm môi trường.'
            : ''
        }`
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
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message}>{event.message}</Text>
      </View>

      <PrimaryButton title="Chia sẻ cảnh báo" onPress={handleShare} />
      <PrimaryButton title="Gửi SMS cho danh bạ" variant="outline" onPress={handleSms} loading={smsLoading} />
      {status === 'active' ? (
        <PrimaryButton title="Tôi đã an toàn" variant="success" onPress={handleSafe} loading={loading} />
      ) : null}
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
    backgroundColor: '#0F172A',
    color: colors.white,
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
  messageBox: {
    backgroundColor: colors.surface,
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
  empty: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border
  }
});
