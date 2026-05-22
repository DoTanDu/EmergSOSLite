import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DangerReportCard from '../components/DangerReportCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { deleteDangerReport, getDangerReports, reportDangerPoint } from '../services/dangerReportService';

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

  function handleDelete(reportId) {
    Alert.alert('Xóa điểm nguy hiểm', 'Bạn chắc chắn muốn xóa báo cáo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDangerReport(reportId);
            await loadReports();
          } catch (error) {
            Alert.alert('Không thể xóa', error.message);
          }
        }
      }
    ]);
  }

  const currentUserId = auth.currentUser?.uid;

  function handleReport(reportId) {
    Alert.alert('Báo cáo ảo / Spam', 'Bạn có chắc chắn điểm nguy hiểm này là giả mạo?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Báo cáo',
        style: 'destructive',
        onPress: async () => {
          try {
            await reportDangerPoint(reportId, currentUserId);
            Alert.alert('Thành công', 'Đã ghi nhận báo cáo. Quản trị viên sẽ xem xét gỡ bỏ điểm này.');
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể gửi báo cáo: ' + error.message);
          }
        }
      }
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadReports} />}
    >
      <Text style={styles.title}>Điểm nguy hiểm</Text>

      <PrimaryButton title="+ Báo cáo điểm nguy hiểm" onPress={() => navigation.navigate('AddDangerReport')} />

      {reports.length === 0 ? (
        <Text style={styles.empty}>Chưa có báo cáo nào.</Text>
      ) : (
        reports.map((report) => (
          <DangerReportCard
            key={report.id}
            report={report}
            canManage={report.userId === currentUserId}
            onEdit={() => navigation.navigate('AddDangerReport', { report })}
            onDelete={() => handleDelete(report.id)}
            onReport={() => handleReport(report.id)}
          />
        ))
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
  empty: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border
  }
});
