import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const HOLD_MS = 3000;

export default function SosButton({ onTrigger, disabled = false }) {
  const timerRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

  function startHold() {
    if (disabled) return;
    setHolding(true);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      useNativeDriver: false
    }).start();

    timerRef.current = setTimeout(() => {
      setHolding(false);
      onTrigger?.();
    }, HOLD_MS);
  }

  function cancelHold() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setHolding(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false
    }).start();
  }

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Pressable
      onPressIn={startHold}
      onPressOut={cancelHold}
      disabled={disabled}
      style={({ pressed }) => [styles.outer, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.circle}>
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.hint}>{holding ? 'Đang kích hoạt...' : 'Nhấn giữ 3 giây'}</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'center',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8
  },
  circle: {
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sosText: {
    color: colors.white,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2
  },
  hint: {
    marginTop: 6,
    color: colors.white,
    fontWeight: '600'
  },
  progressTrack: {
    position: 'absolute',
    bottom: 28,
    width: 145,
    height: 7,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffcdd2'
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryDark
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    opacity: 0.6
  }
});
