import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function RecordCircleButton({ isRecording, onPress }) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.outer, pressed && styles.pressed]}>
        <View style={[styles.inner, isRecording ? styles.innerActive : styles.innerIdle]} />
      </Pressable>
      <Text style={styles.label}>Ghi âm</Text>
      <Text style={styles.hint}>{isRecording ? 'Đang ghi âm' : 'Nhấn để bật/tắt'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 8
  },
  outer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#111827',
    borderWidth: 6,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  inner: {
    width: 92,
    height: 92,
    borderRadius: 46
  },
  innerActive: {
    backgroundColor: '#6D1F1A'
  },
  innerIdle: {
    backgroundColor: '#FF4338'
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  label: {
    marginTop: 10,
    color: colors.white,
    fontWeight: '900',
    fontSize: 16
  },
  hint: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12
  }
});
