import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
      Alert.alert('Lá»—i táº£i danh báº¡', error.message);
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
      Alert.alert('XÃ³a tháº¥t báº¡i', error.message);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContacts} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Danh báº¡ kháº©n cáº¥p</Text>
        <Text style={styles.subtitle}>ThÃªm ngÆ°á»i thÃ¢n/báº¡n bÃ¨ Ä‘á»ƒ demo luá»“ng SOS rÃµ rÃ ng hÆ¡n.</Text>
      </View>

      <PrimaryButton title="+ ThÃªm liÃªn há»‡" onPress={() => navigation.navigate('AddContact')} />

      {contacts.length === 0 ? (
        <Text style={styles.empty}>ChÆ°a cÃ³ liÃªn há»‡ nÃ o. ThÃªm Ã­t nháº¥t 1 ngÆ°á»i Ä‘á»ƒ Ä‘Ãºng luá»“ng demo.</Text>
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

