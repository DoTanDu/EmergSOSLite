import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { formatDate } from '../utils/formatDate';

export default function DangerReportCard({ report, canManage = false, onEdit, onDelete, onReport }) {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{report.type}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.meta}>{report.latitude}, {report.longitude}</Text>
      <Text style={styles.meta}>{formatDate(report.createdAt)}</Text>

      {canManage ? (
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <Text style={[styles.actionText, styles.editText]}>Sửa</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Text style={[styles.actionText, styles.deleteText]}>Xóa</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.reportButton]} onPress={onReport}>
            <Text style={[styles.actionText, styles.reportText]}>Báo cáo ảo / Spam</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
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
  },
  actionRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    minHeight: 34,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  actionText: {
    fontWeight: '800'
  },
  editButton: {
    backgroundColor: colors.secondaryLight,
    borderColor: '#93C5FD'
  },
  editText: {
    color: colors.secondary
  },
  deleteButton: {
    backgroundColor: colors.dangerLight,
    borderColor: '#FCA5A5'
  },
  deleteText: {
    color: colors.danger
  },
  reportButton: {
    backgroundColor: '#334155',
    borderColor: '#475569'
  },
  reportText: {
    color: '#94A3B8'
  }
});
