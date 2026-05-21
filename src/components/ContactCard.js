import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import PrimaryButton from './PrimaryButton';

export default function ContactCard({ contact, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onEdit} style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.meta}>{contact.relationship} • {contact.phone}</Text>
        {contact.email ? <Text style={styles.email}>{contact.email}</Text> : null}
      </Pressable>
      <PrimaryButton title="Xóa" variant="outline" onPress={onDelete} style={styles.deleteButton} />
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
  deleteButton: {
    minHeight: 38,
    paddingHorizontal: 12
  }
});
