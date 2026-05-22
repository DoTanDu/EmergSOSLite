import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import RecordCircleButton from '../components/RecordCircleButton';
import SosButton from '../components/SosButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { getCurrentLocation } from '../services/locationService';
import { createSosEvent, sendSosSms, createSosMessage } from '../services/sosService';
import { getContactsByUser } from '../services/contactService';
import {
  getAmbientRecordingState,
  startAmbientRecording,
  subscribeAmbientRecording,
  toggleAmbientRecording
} from '../services/ambientRecordingService';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [recordingState, setRecordingState] = useState(getAmbientRecordingState());

  useEffect(() => {
    const unsubscribe = subscribeAmbientRecording(setRecordingState);
    return unsubscribe;
  }, []);

  async function handleToggleRecording() {
    try {
      await toggleAmbientRecording();
    } catch (error) {
      Alert.alert('Khong the ghi am', error.message);
    }
  }

  async function handleSosTrigger() {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Loi', 'Ban can dang nhap truoc khi SOS.');

    try {
      setLoading(true);

      if (!recordingState.isRecording) {
        try {
          await startAmbientRecording();
        } catch (recordError) {
          Alert.alert('Canh bao', `Khong bat duoc ghi am moi truong: ${recordError.message}`);
        }
      }

      const location = await getCurrentLocation();
      const offlineMessage = createSosMessage(location);
      let event = {
        message: offlineMessage,
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'active'
      };

      try {
        event = await createSosEvent(user.uid, location);
      } catch (firebaseError) {
        console.warn('Loi Firebase:', firebaseError.message);
        Alert.alert('Offline', 'Khong luu duoc len he thong. Van mo SMS de gui vi tri.');
      }

      try {
        const contacts = await getContactsByUser(user.uid);
        const phones = contacts.map((c) => c.phone).filter(Boolean);
        if (phones.length > 0) {
          await sendSosSms(phones, event.message);
        }
      } catch (smsError) {
        console.warn('Gui SMS tu dong loi:', smsError.message);
      }

      const serializableEvent = {
        ...event,
        createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt
      };
      navigation.navigate('SosAlert', { event: serializableEvent });
    } catch (error) {
      Alert.alert('Khong the kich hoat SOS', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.hello}>EmergSOS Lite</Text>
        <Text style={styles.title}>Nhan giu SOS 3 giay</Text>
      </View>

      <SosButton onTrigger={handleSosTrigger} disabled={loading} />

      <RecordCircleButton isRecording={recordingState.isRecording} onPress={handleToggleRecording} />

      <View style={styles.grid}>
        <PrimaryButton title="Danh ba khan cap" onPress={() => navigation.navigate('Contacts')} style={styles.gridButton} />
        <PrimaryButton title="Lich su SOS" variant="outline" onPress={() => navigation.navigate('SosHistory')} style={styles.gridButton} />
        <PrimaryButton title="Lich su ghi am" variant="outline" onPress={() => navigation.navigate('RecordingHistory')} style={styles.gridButton} />
        <PrimaryButton title="Fake Call" variant="outline" onPress={() => navigation.navigate('FakeCall')} style={styles.gridButton} />
        <PrimaryButton title="Diem nguy hiem" variant="outline" onPress={() => navigation.navigate('DangerMap')} style={styles.gridButton} />
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
