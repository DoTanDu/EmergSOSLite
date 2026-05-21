import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';

const DANGER_COLLECTION = 'dangerReports';

export async function addDangerReport(userId, report) {
  return addDoc(collection(db, DANGER_COLLECTION), {
    userId,
    latitude: report.latitude,
    longitude: report.longitude,
    type: report.type,
    description: report.description.trim(),
    upvotes: 0,
    createdAt: serverTimestamp()
  });
}

export async function getDangerReports() {
  const q = query(collection(db, DANGER_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getDangerReportsByUser(userId) {
  const q = query(
    collection(db, DANGER_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
