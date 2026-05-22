import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import HistoryCard from '../components/HistoryCard';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import {
  createSafeMessage,
  getSosEventsByUser,
  markSosAsSafe,
  sendSosSms,
  shareSosMessage
} from '../services/sosService';
import { getContactsByUser } from '../services/contactService';
import { getAmbientRecordingState, stopAmbientRecording } from '../services/ambientRecordingService';

export default function SosHistoryScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      setLoading(true);
      const data = await getSosEventsByUser(user.uid);
      setEvents(data);
    } catch (error) {
      Alert.alert('Lỗi tải lịch sử', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  async function notifySafeContacts(event) {
    const contacts = await getContactsByUser(event.userId);
    const phones = contacts.map((contact) => contact.phone).filter(Boolean);
    const safeMessage = createSafeMessage(event);

    await sendSosSms(phones, safeMessage);

    Alert.alert(
      'Đã thông báo an toàn',
      phones.length > 0
        ? 'Đã mở màn hình nhắn tin để gửi thông báo an toàn.'
        : 'Không có số trong danh bạ, đã mở chia sẻ để gửi thông báo an toàn.'
    );
  }

  async function handleMarkSafe(event) {
    try {
      await markSosAsSafe(event.id);
      if (getAmbientRecordingState().isRecording) {
        try {
          await stopAmbientRecording();
        } catch (recordingError) {
          console.warn('Dừng ghi âm môi trường lỗi:', recordingError.message);
        }
      }
      await notifySafeContacts(event);
      await loadEvents();
    } catch (error) {
      Alert.alert('Cập nhật thất bại', error.message);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEvents} />}
    >
      <Text style={styles.title}>Lịch sử SOS</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>Chưa có lần SOS nào.</Text>
      ) : (
        events.map((event) => (
          <HistoryCard
            key={event.id}
            event={event}
            onMarkSafe={() => handleMarkSafe(event)}
            onShare={() => shareSosMessage(event.message)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
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
