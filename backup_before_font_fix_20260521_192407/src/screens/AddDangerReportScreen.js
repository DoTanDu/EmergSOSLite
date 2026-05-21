import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { addDangerReport } from '../services/dangerReportService';
import { getCurrentLocation } from '../services/locationService';

const TYPES = ['dark_area', 'theft_risk', 'harassment', 'empty_road', 'other'];

export default function AddDangerReportScreen({ navigation }) {
  const [type, setType] = useState('dark_area');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Lá»—i', 'Báº¡n chÆ°a Ä‘Äƒng nháº­p.');
    if (!description.trim()) return Alert.alert('Lá»—i', 'Nháº­p mÃ´ táº£ Ä‘iá»ƒm nguy hiá»ƒm.');

    try {
      setLoading(true);
      const location = await getCurrentLocation();
      await addDangerReport(user.uid, {
        ...location,
        type,
        description
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('KhÃ´ng thá»ƒ gá»­i bÃ¡o cÃ¡o', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>BÃ¡o cÃ¡o Ä‘iá»ƒm nguy hiá»ƒm</Text>
      <Text style={styles.subtitle}>App sáº½ láº¥y GPS hiá»‡n táº¡i rá»“i lÆ°u report vÃ o Firestore.</Text>

      <Text style={styles.label}>Loáº¡i nguy hiá»ƒm</Text>
      <View style={styles.types}>
        {TYPES.map((item) => (
          <PrimaryButton
            key={item}
            title={item}
            variant={type === item ? 'primary' : 'outline'}
            onPress={() => setType(item)}
            style={styles.typeButton}
          />
        ))}
      </View>

      <TextInputField
        label="MÃ´ táº£"
        value={description}
        onChangeText={setDescription}
        placeholder="VÃ­ dá»¥: Ä‘oáº¡n Ä‘Æ°á»ng tá»‘i, Ã­t ngÆ°á»i qua láº¡i..."
        multiline
      />

      <PrimaryButton title="Gá»­i bÃ¡o cÃ¡o" onPress={handleSubmit} loading={loading} />
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
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  typeButton: {
    minHeight: 38
  }
});

