import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createAudioPlayer } from 'expo-audio';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { colors } from '../constants/colors';
import {
  clearRecordingHistory,
  getRecordingHistory,
  removeRecordingHistoryItem
} from '../services/ambientRecordingService';
import { formatDate } from '../utils/formatDate';

function formatDuration(durationMillis) {
  const totalSeconds = Math.max(0, Math.floor((durationMillis || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function RecordingHistoryScreen() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  const playerRef = useRef(null);
  const playerSubscriptionRef = useRef(null);

  const stopPlayback = useCallback(() => {
    if (playerSubscriptionRef.current) {
      playerSubscriptionRef.current.remove();
      playerSubscriptionRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
      playerRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const history = await getRecordingHistory();
      setRecordings(history);
    } catch (error) {
      Alert.alert('Loi tai du lieu', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      return undefined;
    }, [loadHistory])
  );

  useEffect(() => {
    return () => stopPlayback();
  }, [stopPlayback]);

  async function handlePlayOrStop(item) {
    if (!item?.uri) {
      Alert.alert('Khong co file', 'Ban ghi nay khong co duong dan file.');
      return;
    }

    if (playingId === item.id) {
      stopPlayback();
      return;
    }

    try {
      stopPlayback();
      const player = createAudioPlayer({ uri: item.uri }, { updateInterval: 300 });
      playerSubscriptionRef.current = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          stopPlayback();
        }
      });
      playerRef.current = player;
      setPlayingId(item.id);
      player.play();
    } catch (error) {
      stopPlayback();
      Alert.alert('Khong the phat ghi am', error.message);
    }
  }

  async function handleDelete(item) {
    try {
      if (playingId === item.id) {
        stopPlayback();
      }
      const next = await removeRecordingHistoryItem(item.id);
      setRecordings(next);
    } catch (error) {
      Alert.alert('Khong the xoa', error.message);
    }
  }

  async function handleClearAll() {
    try {
      stopPlayback();
      const next = await clearRecordingHistory();
      setRecordings(next);
    } catch (error) {
      Alert.alert('Khong the xoa tat ca', error.message);
    }
  }

  function renderItem({ item }) {
    const isPlaying = playingId === item.id;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ban ghi am moi truong</Text>
        <Text style={styles.meta}>Thoi gian: {formatDate(item.createdAt)}</Text>
        <Text style={styles.meta}>Do dai: {formatDuration(item.durationMillis)}</Text>
        <Text style={styles.uri} numberOfLines={1}>
          {item.uri}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={() => handlePlayOrStop(item)}
            style={[styles.actionBtn, isPlaying ? styles.stopBtn : styles.playBtn]}
          >
            <Text style={styles.actionText}>{isPlaying ? 'Dung' : 'Nghe lai'}</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={[styles.actionBtn, styles.deleteBtn]}>
            <Text style={styles.actionText}>Xoa</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Lich su ghi am</Text>
          {recordings.length > 0 ? (
            <PrimaryButton title="Xoa tat ca" variant="outline" onPress={handleClearAll} style={styles.clearAllBtn} />
          ) : null}
        </View>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          onRefresh={loadHistory}
          refreshing={loading}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>Chua co file ghi am nao.</Text>}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900'
  },
  clearAllBtn: {
    minHeight: 42,
    paddingHorizontal: 14
  },
  listContent: {
    paddingBottom: 20,
    gap: 12
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.muted,
    padding: 14
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16
  },
  meta: {
    color: colors.muted
  },
  uri: {
    color: colors.secondary,
    fontSize: 12
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10
  },
  actionBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  playBtn: {
    backgroundColor: colors.secondaryLight,
    borderColor: '#385A8C'
  },
  stopBtn: {
    backgroundColor: colors.warningLight,
    borderColor: '#7A6222'
  },
  deleteBtn: {
    backgroundColor: colors.dangerLight,
    borderColor: '#6E2A39'
  },
  actionText: {
    color: colors.text,
    fontWeight: '800'
  }
});
