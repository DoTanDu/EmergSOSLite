import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import HistoryCard from '../components/HistoryCard';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { getSosEventsByUser, markSosAsSafe, shareSosMessage } from '../services/sosService';

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

  async function handleMarkSafe(eventId) {
    try {
      await markSosAsSafe(eventId);
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
      <Text style={styles.subtitle}>Event mới nhất lên đầu. Mỗi event có trạng thái active hoặc safe.</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>Chưa có lần SOS nào.</Text>
      ) : (
        events.map((event) => (
          <HistoryCard
            key={event.id}
            event={event}
            onMarkSafe={() => handleMarkSafe(event.id)}
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
  subtitle: {
    color: colors.muted,
    lineHeight: 20
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
