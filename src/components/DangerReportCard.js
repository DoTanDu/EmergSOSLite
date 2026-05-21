import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { formatDate } from '../utils/formatDate';

export default function DangerReportCard({ report }) {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{report.type}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.meta}>{report.latitude}, {report.longitude}</Text>
      <Text style={styles.meta}>{formatDate(report.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  type: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: '900'
  },
  description: {
    color: colors.text,
    fontSize: 15
  },
  meta: {
    color: colors.muted,
    fontSize: 12
  }
});
