import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { loginUser } from '../services/authService';
import { colors } from '../constants/colors';
import { appText } from '../constants/appText';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Thiáº¿u thÃ´ng tin', 'Nháº­p email vÃ  máº­t kháº©u trÆ°á»›c Ä‘Ã£.');
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email, password });
    } catch (error) {
      Alert.alert('ÄÄƒng nháº­p lá»—i', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{appText.appName}</Text>
        <Text style={styles.subtitle}>ÄÄƒng nháº­p Ä‘á»ƒ quáº£n lÃ½ SOS, danh báº¡ vÃ  lá»‹ch sá»­ cáº£nh bÃ¡o.</Text>
      </View>

      <TextInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="demo@email.com"
      />
      <TextInputField
        label="Máº­t kháº©u"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
      />

      <PrimaryButton title="ÄÄƒng nháº­p" onPress={handleLogin} loading={loading} />
      <PrimaryButton title="Táº¡o tÃ i khoáº£n má»›i" variant="outline" onPress={() => navigation.navigate('Register')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 42,
    marginBottom: 12
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    lineHeight: 20
  }
});

