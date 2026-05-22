import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ContactCard from '../components/ContactCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { auth } from '../config/firebase';
import { deleteContact, getContactsByUser } from '../services/contactService';

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadContacts = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      setLoading(true);
      const data = await getContactsByUser(user.uid);
      setContacts(data);
    } catch (error) {
      Alert.alert('Lỗi tải danh bạ', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  async function handleDelete(contactId) {
    try {
      await deleteContact(contactId);
      await loadContacts();
    } catch (error) {
      Alert.alert('Xóa thất bại', error.message);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContacts} />}
    >
      <Text style={styles.title}>Danh bạ khẩn cấp</Text>

      <PrimaryButton title="+ Thêm liên hệ" onPress={() => navigation.navigate('AddContact')} />

      {contacts.length === 0 ? (
        <Text style={styles.empty}>Chưa có liên hệ nào.</Text>
      ) : (
        contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={() => navigation.navigate('AddContact', { contact })}
            onDelete={() => handleDelete(contact.id)}
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
