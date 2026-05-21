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
      Alert.alert('Lá»—i táº£i lá»‹ch sá»­', error.message);
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
      Alert.alert('Cáº­p nháº­t tháº¥t báº¡i', error.message);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEvents} />}
    >
      <Text style={styles.title}>Lá»‹ch sá»­ SOS</Text>
      <Text style={styles.subtitle}>Event má»›i nháº¥t lÃªn Ä‘áº§u. Má»—i event cÃ³ tráº¡ng thÃ¡i active hoáº·c safe.</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>ChÆ°a cÃ³ láº§n SOS nÃ o.</Text>
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

