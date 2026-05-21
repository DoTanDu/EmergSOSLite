import React from 'react';
import { Pressable, StyleSheet, Text, View, Linking, Alert } from 'react-native';
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
      <Pressable onPress={onEdit} style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.meta}>{contact.relationship} • {contact.phone}</Text>
        {contact.email ? <Text style={styles.email}>{contact.email}</Text> : null}
      </Pressable>
      <View style={styles.actions}>
        <PrimaryButton title="Gọi" onPress={handleCall} style={styles.actionButton} />
        <PrimaryButton title="Xóa" variant="outline" onPress={onDelete} style={styles.actionButton} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  info: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  meta: {
    marginTop: 4,
    color: colors.muted
  },
  email: {
    marginTop: 2,
    color: colors.secondary
  },
  actions: {
    gap: 8
  },
  actionButton: {
    minHeight: 38,
    paddingHorizontal: 12
  }
});
