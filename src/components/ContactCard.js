import React from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import PrimaryButton from './PrimaryButton';

export default function ContactCard({ contact, onEdit, onDelete }) {
  const handleCall = async () => {
    const url = `tel:${contact.phone}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Lỗi', 'Thiết bị không hỗ trợ gọi điện trực tiếp.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.meta}>{contact.relationship} • {contact.phone}</Text>
        {contact.email ? <Text style={styles.email}>{contact.email}</Text> : null}
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Gọi" onPress={handleCall} style={styles.actionButton} />
        <PrimaryButton title="Sửa" variant="outline" onPress={onEdit} style={styles.actionButton} />
        <PrimaryButton title="Xóa" variant="danger" onPress={onDelete} style={styles.actionButton} />
      </View>
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
    gap: 12
  },
  info: {
    gap: 2
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  meta: {
    color: colors.muted
  },
  email: {
    color: colors.secondary
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  actionButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    flexGrow: 1
  }
});