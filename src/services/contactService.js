import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

const CONTACTS_COLLECTION = 'emergencyContacts';

export async function getContactsByUser(userId) {
  const q = query(
    collection(db, CONTACTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function addContact(userId, contact) {
  return addDoc(collection(db, CONTACTS_COLLECTION), {
    userId,
    name: contact.name.trim(),
    phone: contact.phone.trim(),
    email: contact.email?.trim() || '',
    relationship: contact.relationship.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateContact(contactId, contact) {
  return updateDoc(doc(db, CONTACTS_COLLECTION, contactId), {
    name: contact.name.trim(),
    phone: contact.phone.trim(),
    email: contact.email?.trim() || '',
    relationship: contact.relationship.trim(),
    updatedAt: serverTimestamp()
  });
}

export async function deleteContact(contactId) {
  return deleteDoc(doc(db, CONTACTS_COLLECTION, contactId));
}
