import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { colors } from '../constants/colors';

const DELAYS = [5, 10, 30];

export default function FakeCallScreen({ navigation }) {
  const [callerName, setCallerName] = useState('Mẹ');
  const [selectedDelay, setSelectedDelay] = useState(5);
  const [running, setRunning] = useState(false);

  function startFakeCall() {
    setRunning(true);
    Alert.alert('Đã hẹn cuộc gọi giả', `Cuộc gọi sẽ hiện sau ${selectedDelay} giây.`);
    setTimeout(() => {
      setRunning(false);
      navigation.navigate('IncomingFakeCall', { callerName });
    }, selectedDelay * 1000);
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Fake Call</Text>

      <TextInputField label="Tên người gọi" value={callerName} onChangeText={setCallerName} placeholder="Mẹ" />

      <Text style={styles.label}>Thời gian chờ</Text>
      <View style={styles.delayRow}>
        {DELAYS.map((delay) => (
          <PrimaryButton
            key={delay}
            title={`${delay}s`}
            variant={selectedDelay === delay ? 'primary' : 'outline'}
            onPress={() => setSelectedDelay(delay)}
            style={styles.delayButton}
          />
        ))}
      </View>

      <PrimaryButton title={running ? 'Đang chờ...' : 'Bắt đầu Fake Call'} onPress={startFakeCall} disabled={running} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
  },
  label: {
    color: colors.text,
    fontWeight: '800'
  },
  delayRow: {
    flexDirection: 'row',
    gap: 10
  },
  delayButton: {
    flex: 1
  }
});
