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

function buildMapLinks(latitude, longitude, existingUrl = '') {
  const primaryUrl = existingUrl || createMapUrl(latitude, longitude);
  if (!primaryUrl) return [];

  const secondaryUrl = primaryUrl.replace('https://maps.google.com/?q=', 'https://www.google.com/maps?q=');
  if (secondaryUrl === primaryUrl) return [primaryUrl];
  return [primaryUrl, secondaryUrl];
}

export function createSosMessage({ latitude, longitude, createdAt = new Date() }) {
  const mapLinks = buildMapLinks(latitude, longitude);

  return [
    'Tôi đang cần trợ giúp khẩn cấp!',
    '',
    'Link vị trí hiện tại:',
    ...mapLinks,
    '',
    `Thời gian: ${formatDate(createdAt)}`,
    'Vui lòng liên hệ hoặc đến hỗ trợ tôi sớm nhất có thể.'
  ].join('\n');
}

export function createSafeMessage(event = {}) {
  const latitude = event.latitude;
  const longitude = event.longitude;
  const mapLinks = buildMapLinks(latitude, longitude, event.mapUrl || '');

  return [
    'Tôi đã an toàn!',
    '',
    'Cảnh báo SOS trước đó đã kết thúc.',
    ...(mapLinks.length > 0 ? ['Link vị trí đã gửi trước đó:', ...mapLinks, ''] : []),
    `Thời gian cập nhật: ${formatDate(new Date())}`,
    'Cảm ơn bạn đã quan tâm và hỗ trợ.'
  ].join('\n');
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
