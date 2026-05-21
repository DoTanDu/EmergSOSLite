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
    if (!user) return Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
    if (!description.trim()) return Alert.alert('Lỗi', 'Nhập mô tả điểm nguy hiểm.');

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
      Alert.alert('Không thể gửi báo cáo', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Báo cáo điểm nguy hiểm</Text>
      <Text style={styles.subtitle}>App sẽ lấy GPS hiện tại rồi lưu report vào Firestore.</Text>

      <Text style={styles.label}>Loại nguy hiểm</Text>
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
        label="Mô tả"
        value={description}
        onChangeText={setDescription}
        placeholder="Ví dụ: đoạn đường tối, ít người qua lại..."
        multiline
      />

      <PrimaryButton title="Gửi báo cáo" onPress={handleSubmit} loading={loading} />
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
