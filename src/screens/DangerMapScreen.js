import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DangerReportCard from '../components/DangerReportCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { getDangerReports } from '../services/dangerReportService';

export default function DangerMapScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDangerReports();
      setReports(data);
    } catch (error) {
      Alert.alert('Lỗi tải điểm nguy hiểm', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadReports} />}
    >
      <Text style={styles.title}>Điểm nguy hiểm</Text>
      <Text style={styles.subtitle}>Bản Lite dùng list dự phòng. Nếu map ổn, Thành viên 2 có thể thay bằng react-native-maps marker.</Text>

      <PrimaryButton title="+ Báo cáo điểm nguy hiểm" onPress={() => navigation.navigate('AddDangerReport')} />

      {reports.length === 0 ? (
        <Text style={styles.empty}>Chưa có báo cáo nào.</Text>
      ) : (
        reports.map((report) => <DangerReportCard key={report.id} report={report} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20
  },
  empty: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border
  }
});
