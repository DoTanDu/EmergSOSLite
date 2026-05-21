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
      Alert.alert('Lá»—i táº£i Ä‘iá»ƒm nguy hiá»ƒm', error.message);
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
      <Text style={styles.title}>Äiá»ƒm nguy hiá»ƒm</Text>
      <Text style={styles.subtitle}>Báº£n Lite dÃ¹ng list dá»± phÃ²ng. Náº¿u map á»•n, ThÃ nh viÃªn 2 cÃ³ thá»ƒ thay báº±ng react-native-maps marker.</Text>

      <PrimaryButton title="+ BÃ¡o cÃ¡o Ä‘iá»ƒm nguy hiá»ƒm" onPress={() => navigation.navigate('AddDangerReport')} />

      {reports.length === 0 ? (
        <Text style={styles.empty}>ChÆ°a cÃ³ bÃ¡o cÃ¡o nÃ o.</Text>
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

