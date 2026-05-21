import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { formatDate } from '../utils/formatDate';
import PrimaryButton from './PrimaryButton';

export default function HistoryCard({ event, onMarkSafe, onShare }) {
  const isActive = event.status === 'active';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>SOS Alert</Text>
        <Text style={[styles.badge, isActive ? styles.active : styles.safe]}>
          {isActive ? 'ACTIVE' : 'SAFE'}
        </Text>
      </View>
      <Text style={styles.time}>{formatDate(event.createdAt)}</Text>
      <Text style={styles.location}>{event.latitude}, {event.longitude}</Text>
      {event.mapUrl ? <Text style={styles.link}>{event.mapUrl}</Text> : null}
      <View style={styles.actions}>
        {isActive ? <PrimaryButton title="TÃ´i Ä‘Ã£ an toÃ n" variant="success" onPress={onMarkSafe} style={styles.actionButton} /> : null}
        <PrimaryButton title="Chia sáº» láº¡i" variant="outline" onPress={onShare} style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800'
  },
  active: {
    backgroundColor: colors.danger
  },
  safe: {
    backgroundColor: colors.success
  },
  time: {
    color: colors.muted
  },
  location: {
    color: colors.text,
    fontWeight: '600'
  },
  link: {
    color: colors.secondary
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  actionButton: {
    minHeight: 40,
    flexGrow: 1
  }
});

