import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { markSosAsSafe, shareSosMessage } from '../services/sosService';

export default function SosAlertScreen({ navigation, route }) {
  const event = route.params?.event;
  const [status, setStatus] = useState(event?.status || 'active');
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <ScreenContainer>
        <Text>KhÃ´ng cÃ³ dá»¯ liá»‡u SOS.</Text>
      </ScreenContainer>
    );
  }

  async function handleShare() {
    try {
      await shareSosMessage(event.message);
    } catch (error) {
      Alert.alert('KhÃ´ng thá»ƒ chia sáº»', error.message);
    }
  }

  async function handleSafe() {
    try {
      setLoading(true);
      await markSosAsSafe(event.id);
      setStatus('safe');
      Alert.alert('ÄÃ£ cáº­p nháº­t', 'Tráº¡ng thÃ¡i SOS Ä‘Ã£ chuyá»ƒn sang an toÃ n.');
    } catch (error) {
      Alert.alert('Cáº­p nháº­t tháº¥t báº¡i', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.alertBox}>
        <Text style={styles.badge}>{status === 'active' ? 'ÄANG SOS' : 'ÄÃƒ AN TOÃ€N'}</Text>
        <Text style={styles.title}>Cáº£nh bÃ¡o Ä‘Ã£ Ä‘Æ°á»£c táº¡o</Text>
        <Text style={styles.subtitle}>Kiá»ƒm tra ná»™i dung bÃªn dÆ°á»›i rá»“i báº¥m chia sáº» qua Zalo/Messenger/SMS/Gmail.</Text>
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message}>{event.message}</Text>
      </View>

      <PrimaryButton title="Chia sáº» cáº£nh bÃ¡o" onPress={handleShare} />
      {status === 'active' ? <PrimaryButton title="TÃ´i Ä‘Ã£ an toÃ n" variant="success" onPress={handleSafe} loading={loading} /> : null}
      <PrimaryButton title="Xem lá»‹ch sá»­ SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    color: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '900',
    overflow: 'hidden'
  },
  title: {
    marginTop: 12,
    color: colors.white,
    fontSize: 26,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 8,
    color: colors.white,
    lineHeight: 20,
    opacity: 0.95
  },
  messageBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  message: {
    color: colors.text,
    lineHeight: 22,
    fontSize: 15
  }
});

