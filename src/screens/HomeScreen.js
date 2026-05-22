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
    if (!user) return Alert.alert('Lỗi', 'Bạn cần đăng nhập trước khi SOS.');

    try {
      setLoading(true);
      const location = await getCurrentLocation();
      const event = await createSosEvent(user.uid, location);
      navigation.navigate('SosAlert', { event });
    } catch (error) {
      Alert.alert('Không thể kích hoạt SOS', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.hello}>EmergSOS Lite</Text>
        <Text style={styles.title}>Nhấn giữ SOS 3 giây</Text>
      </View>

      <SosButton onTrigger={handleSosTrigger} disabled={loading} />

      <View style={styles.grid}>
        <PrimaryButton title="Danh bạ khẩn cấp" onPress={() => navigation.navigate('Contacts')} style={styles.gridButton} />
        <PrimaryButton title="Lịch sử SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} style={styles.gridButton} />
        <PrimaryButton title="Fake Call" variant="outline" onPress={() => navigation.navigate('FakeCall')} style={styles.gridButton} />
        <PrimaryButton title="Điểm nguy hiểm" variant="outline" onPress={() => navigation.navigate('DangerMap')} style={styles.gridButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171A23'
  },
  topCard: {
    backgroundColor: '#101828',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A3142'
  },
  hello: {
    color: '#98A2B3',
    fontWeight: '700'
  },
  title: {
    marginTop: 6,
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900'
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
