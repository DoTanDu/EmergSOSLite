import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import SosButton from '../components/SosButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { getCurrentLocation } from '../services/locationService';
import { createSosEvent } from '../services/sosService';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleSosTrigger() {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Lá»—i', 'Báº¡n cáº§n Ä‘Äƒng nháº­p trÆ°á»›c khi SOS.');

    try {
      setLoading(true);
      const location = await getCurrentLocation();
      const event = await createSosEvent(user.uid, location);
      navigation.navigate('SosAlert', { event });
    } catch (error) {
      Alert.alert('KhÃ´ng thá»ƒ kÃ­ch hoáº¡t SOS', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.topCard}>
        <Text style={styles.hello}>Xin chÃ o ðŸ‘‹</Text>
        <Text style={styles.title}>Khi gáº·p nguy hiá»ƒm, nháº¥n giá»¯ nÃºt SOS trong 3 giÃ¢y.</Text>
      </View>

      <SosButton onTrigger={handleSosTrigger} disabled={loading} />
      <Text style={styles.note}>{loading ? 'Äang láº¥y vá»‹ trÃ­ vÃ  táº¡o cáº£nh bÃ¡o...' : 'TrÃ¡nh báº¥m nháº§m: nÃºt SOS chá»‰ cháº¡y khi nháº¥n giá»¯ Ä‘á»§ thá»i gian.'}</Text>

      <View style={styles.grid}>
        <PrimaryButton title="Danh báº¡ kháº©n cáº¥p" onPress={() => navigation.navigate('Contacts')} style={styles.gridButton} />
        <PrimaryButton title="Lá»‹ch sá»­ SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} style={styles.gridButton} />
        <PrimaryButton title="Fake Call" variant="outline" onPress={() => navigation.navigate('FakeCall')} style={styles.gridButton} />
        <PrimaryButton title="Äiá»ƒm nguy hiá»ƒm" variant="outline" onPress={() => navigation.navigate('DangerMap')} style={styles.gridButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  hello: {
    color: colors.muted,
    fontWeight: '700'
  },
  title: {
    marginTop: 6,
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '900'
  },
  note: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20
  },
  grid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  gridButton: {
    flexGrow: 1,
    minWidth: '47%'
  }
});

