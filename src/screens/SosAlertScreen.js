import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { markSosAsSafe, sendSosSms } from '../services/sosService';
import { getContactsByUser } from '../services/contactService';

export default function SosAlertScreen({ navigation, route }) {
  const event = route.params?.event;
  const [status, setStatus] = useState(event?.status || 'active');
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <ScreenContainer>
        <Text>Không có dữ liệu SOS.</Text>
      </ScreenContainer>
    );
  }

  async function handleShare() {
    try {
      setLoading(true);
      const contacts = await getContactsByUser(event.userId);
      const phones = contacts.map(c => c.phone).filter(Boolean);
      await sendSosSms(phones, event.message);
    } catch (error) {
      Alert.alert('Không thể chia sẻ', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSafe() {
    try {
      setLoading(true);
      await markSosAsSafe(event.id);
      setStatus('safe');
      
      // Auto pre-fill SMS to notify contacts that user is safe
      const contacts = await getContactsByUser(event.userId);
      const phones = contacts.map(c => c.phone).filter(Boolean);
      const safeMessage = 'Tôi đã an toàn. Tình huống khẩn cấp đã được giải quyết. Cảm ơn bạn đã quan tâm!';
      
      await sendSosSms(phones, safeMessage);
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
      {status === 'active' ? <PrimaryButton title="Tôi đã an toàn" variant="success" onPress={handleSafe} loading={loading} /> : null}
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
  }
});
