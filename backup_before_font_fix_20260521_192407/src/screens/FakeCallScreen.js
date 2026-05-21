import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { colors } from '../constants/colors';

const DELAYS = [5, 10, 30];

export default function FakeCallScreen({ navigation }) {
  const [callerName, setCallerName] = useState('Máº¹');
  const [selectedDelay, setSelectedDelay] = useState(5);
  const [running, setRunning] = useState(false);

  function startFakeCall() {
    setRunning(true);
    Alert.alert('ÄÃ£ háº¹n cuá»™c gá»i giáº£', `Cuá»™c gá»i sáº½ hiá»‡n sau ${selectedDelay} giÃ¢y.`);
    setTimeout(() => {
      setRunning(false);
      navigation.navigate('IncomingFakeCall', { callerName });
    }, selectedDelay * 1000);
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Fake Call</Text>
      <Text style={styles.subtitle}>Bonus máº¡nh: giáº£ láº­p cuá»™c gá»i Ä‘áº¿n Ä‘á»ƒ thoÃ¡t tÃ¬nh huá»‘ng khÃ³ xá»­.</Text>

      <TextInputField label="TÃªn ngÆ°á»i gá»i" value={callerName} onChangeText={setCallerName} placeholder="Máº¹" />

      <Text style={styles.label}>Chá»n thá»i gian chá»</Text>
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

      <PrimaryButton title={running ? 'Äang chá»...' : 'Báº¯t Ä‘áº§u Fake Call'} onPress={startFakeCall} disabled={running} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20
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

