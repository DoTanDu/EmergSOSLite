import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';

const RINGTONE_SOURCE = require('../../assets/fake-call-ringtone.wav');

export default function IncomingFakeCallScreen({ navigation, route }) {
  const callerName = route.params?.callerName || 'Người thân';
  const ringtonePlayer = useAudioPlayer(RINGTONE_SOURCE);
  const [isAnswered, setIsAnswered] = useState(false);
  const [seconds, setSeconds] = useState(0);

  function stopRingtone() {
    try {
      ringtonePlayer.pause();
      ringtonePlayer.seekTo(0);
    } catch (error) {
      // Ignore audio cleanup errors during demo.
    }

    Vibration.cancel();
  }

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers'
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isAnswered) {
      stopRingtone();
      return undefined;
    }

    try {
      ringtonePlayer.loop = true;
      ringtonePlayer.seekTo(0);
      ringtonePlayer.play();
      Vibration.vibrate([0, 900, 500], true);
    } catch (error) {
      // If audio fails on a device, fake call UI still works.
      Vibration.vibrate([0, 900, 500], true);
    }

    return () => stopRingtone();
  }, [isAnswered, ringtonePlayer]);

  useEffect(() => {
    if (!isAnswered) return undefined;

    const interval = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswered]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const remainSeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainSeconds}`;
  };

  function handleReject() {
    stopRingtone();
    navigation.goBack();
  }

  function handleAnswer() {
    stopRingtone();
    setIsAnswered(true);
  }

  function handleEndCall() {
    stopRingtone();
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.calling}>{isAnswered ? formatTime(seconds) : 'Cuộc gọi đến...'}</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{callerName.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{callerName}</Text>
      <Text style={styles.phone}>Di động</Text>

      <View style={styles.actions}>
        {isAnswered ? (
          <PrimaryButton title="Kết thúc" variant="danger" onPress={handleEndCall} style={styles.button} />
        ) : (
          <>
            <PrimaryButton title="Từ chối" variant="danger" onPress={handleReject} style={styles.button} />
            <PrimaryButton title="Nghe máy" variant="success" onPress={handleAnswer} style={styles.button} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  calling: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 18
  },
  avatar: {
    marginTop: 28,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '900'
  },
  name: {
    marginTop: 18,
    color: colors.white,
    fontSize: 34,
    fontWeight: '900'
  },
  phone: {
    marginTop: 4,
    color: colors.white,
    opacity: 0.75
  },
  actions: {
    position: 'absolute',
    bottom: 70,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1
  }
});