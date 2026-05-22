import { Share } from 'react-native';
import * as SMS from 'expo-sms';
import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { createMapUrl } from '../utils/createMapUrl';
import { formatDate } from '../utils/formatDate';

const SOS_COLLECTION = 'sosEvents';

export function createSosMessage({ latitude, longitude, createdAt = new Date() }) {
  const mapUrl = createMapUrl(latitude, longitude);

  return `Tôi đang cần trợ giúp khẩn cấp!\n\nVị trí hiện tại của tôi:\n${mapUrl}\n\nThời gian: ${formatDate(createdAt)}\nVui lòng liên hệ hoặc đến hỗ trợ tôi sớm nhất có thể.`;
}

export function createSafeMessage(event = {}) {
  const latitude = event.latitude;
  const longitude = event.longitude;
  const mapUrl = event.mapUrl || (latitude && longitude ? createMapUrl(latitude, longitude) : 'Không có vị trí');

  return `Tôi đã an toàn!\n\nCảnh báo SOS trước đó đã được kết thúc.\nVị trí đã gửi trước đó:\n${mapUrl}\n\nThời gian cập nhật: ${formatDate(new Date())}\nCảm ơn bạn đã quan tâm và hỗ trợ.`;
}

export async function createSosEvent(userId, location) {
  const createdAt = new Date();
  const mapUrl = createMapUrl(location.latitude, location.longitude);
  const message = createSosMessage({ ...location, createdAt });

  const ref = await addDoc(collection(db, SOS_COLLECTION), {
    userId,
    latitude: location.latitude,
    longitude: location.longitude,
    mapUrl,
    message,
    status: 'active',
    createdAt: serverTimestamp(),
    endedAt: null
  });

  return {
    id: ref.id,
    userId,
    ...location,
    mapUrl,
    message,
    status: 'active',
    createdAt
  };
}

export async function shareSosMessage(message) {
  return Share.share({ message });
}

export async function sendSosSms(phones, message) {
  const cleanedPhones = Array.isArray(phones)
    ? phones.map((phone) => String(phone).trim()).filter(Boolean)
    : [];

  const isAvailable = await SMS.isAvailableAsync();

  if (isAvailable && cleanedPhones.length > 0) {
    return SMS.sendSMSAsync(cleanedPhones, message);
  }

  return Share.share({ message });
}

export async function sendSafeMessageToContacts(contacts, event) {
  const phones = Array.isArray(contacts)
    ? contacts.map((contact) => contact.phone).filter(Boolean)
    : [];

  const safeMessage = createSafeMessage(event);
  return sendSosSms(phones, safeMessage);
}

export async function getSosEventsByUser(userId) {
  const q = query(
    collection(db, SOS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function markSosAsSafe(eventId) {
  return updateDoc(doc(db, SOS_COLLECTION, eventId), {
    status: 'safe',
    endedAt: serverTimestamp()
  });
}