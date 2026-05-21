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
    if (!user) return Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
    if (!form.name.trim()) return Alert.alert('Lỗi', 'Nhập tên liên hệ.');
    if (!isValidPhone(form.phone)) return Alert.alert('Lỗi', 'Số điện thoại không hợp lệ.');
    if (!form.relationship.trim()) return Alert.alert('Lỗi', 'Nhập mối quan hệ.');

    try {
      setLoading(true);
      if (editingContact) {
        await updateContact(editingContact.id, form);
      } else {
        await addContact(user.uid, form);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lưu thất bại', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>{editingContact ? 'Sửa liên hệ' : 'Thêm liên hệ'}</Text>
      <TextInputField label="Tên" value={form.name} onChangeText={(v) => setValue('name', v)} placeholder="Mẹ" />
      <TextInputField label="Số điện thoại" value={form.phone} onChangeText={(v) => setValue('phone', v)} keyboardType="phone-pad" placeholder="09xxxxxxxx" />
      <TextInputField label="Email" value={form.email} onChangeText={(v) => setValue('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="Có thể để trống" />
      <TextInputField label="Quan hệ" value={form.relationship} onChangeText={(v) => setValue('relationship', v)} placeholder="Mẹ / Ba / Bạn / Anh chị" />
      <PrimaryButton title="Lưu liên hệ" onPress={handleSave} loading={loading} />
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
