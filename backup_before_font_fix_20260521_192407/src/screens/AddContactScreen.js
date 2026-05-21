import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { addContact, updateContact } from '../services/contactService';
import { isValidPhone } from '../utils/validators';

export default function AddContactScreen({ navigation, route }) {
  const editingContact = route.params?.contact;
  const [form, setForm] = useState({
    name: editingContact?.name || '',
    phone: editingContact?.phone || '',
    email: editingContact?.email || '',
    relationship: editingContact?.relationship || ''
  });
  const [loading, setLoading] = useState(false);

  function setValue(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Lá»—i', 'Báº¡n chÆ°a Ä‘Äƒng nháº­p.');
    if (!form.name.trim()) return Alert.alert('Lá»—i', 'Nháº­p tÃªn liÃªn há»‡.');
    if (!isValidPhone(form.phone)) return Alert.alert('Lá»—i', 'Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡.');
    if (!form.relationship.trim()) return Alert.alert('Lá»—i', 'Nháº­p má»‘i quan há»‡.');

    try {
      setLoading(true);
      if (editingContact) {
        await updateContact(editingContact.id, form);
      } else {
        await addContact(user.uid, form);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('LÆ°u tháº¥t báº¡i', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>{editingContact ? 'Sá»­a liÃªn há»‡' : 'ThÃªm liÃªn há»‡'}</Text>
      <TextInputField label="TÃªn" value={form.name} onChangeText={(v) => setValue('name', v)} placeholder="Máº¹" />
      <TextInputField label="Sá»‘ Ä‘iá»‡n thoáº¡i" value={form.phone} onChangeText={(v) => setValue('phone', v)} keyboardType="phone-pad" placeholder="09xxxxxxxx" />
      <TextInputField label="Email" value={form.email} onChangeText={(v) => setValue('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="CÃ³ thá»ƒ Ä‘á»ƒ trá»‘ng" />
      <TextInputField label="Quan há»‡" value={form.relationship} onChangeText={(v) => setValue('relationship', v)} placeholder="Máº¹ / Ba / Báº¡n / Anh chá»‹" />
      <PrimaryButton title="LÆ°u liÃªn há»‡" onPress={handleSave} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '900',
    color: colors.text
  }
});

