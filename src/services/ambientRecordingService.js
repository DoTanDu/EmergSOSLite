import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioModule, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';

const RECORDING_HISTORY_KEY = '@ambient_recording_history_v1';
const RECORDING_COLLECTION = 'recordingEvents';

let recorder = null;
let recordingState = {
  isRecording: false,
  startedAt: null,
  durationMillis: 0,
  lastRecordingUri: null,
  error: null
};
let recordingHistoryCache = null;

const listeners = new Set();

function snapshot() {
  return { ...recordingState };
}

function notify() {
  const state = snapshot();
  listeners.forEach((listener) => listener(state));
}

function setState(patch) {
  recordingState = { ...recordingState, ...patch };
  notify();
}

async function ensurePermission() {
  const permission = await requestRecordingPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Microphone permission is required to record ambient audio.');
  }
}

async function configureAudioMode() {
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    allowsBackgroundRecording: true,
    interruptionMode: 'duckOthers',
    shouldRouteThroughEarpiece: false
  });
}

async function loadRecordingHistory() {
  if (recordingHistoryCache) return recordingHistoryCache;

  try {
    const raw = await AsyncStorage.getItem(RECORDING_HISTORY_KEY);
    recordingHistoryCache = raw ? JSON.parse(raw) : [];
  } catch {
    recordingHistoryCache = [];
  }

  return recordingHistoryCache;
}

async function saveRecordingHistory(history) {
  recordingHistoryCache = history;
  await AsyncStorage.setItem(RECORDING_HISTORY_KEY, JSON.stringify(history));
}

async function appendRecordingHistoryEntry(entry) {
  const current = await loadRecordingHistory();
  const next = [entry, ...current].slice(0, 100);
  await saveRecordingHistory(next);
  return next;
}

async function updateRecordingHistoryEntry(entryId, patch) {
  const current = await loadRecordingHistory();
  const next = current.map((item) => (item.id === entryId ? { ...item, ...patch } : item));
  await saveRecordingHistory(next);
  return next;
}

function createRecordingEntry(uri, durationMillis) {
  const userId = auth.currentUser?.uid || null;
  return {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    uri,
    durationMillis,
    createdAt: new Date().toISOString(),
    synced: false,
    remoteId: null,
    downloadUrl: null
  };
}

function getFileExtension(uri = '') {
  const cleanUri = uri.split('?')[0];
  const lastDot = cleanUri.lastIndexOf('.');
  if (lastDot === -1) return 'm4a';
  const ext = cleanUri.slice(lastDot + 1).toLowerCase();
  return ext || 'm4a';
}

async function uploadRecordingToCloud(entry) {
  const user = auth.currentUser;
  if (!user?.uid || !entry?.uri) return null;

  const extension = getFileExtension(entry.uri);
  const fileName = `${Date.now()}_${entry.id}.${extension}`;
  const storagePath = `users/${user.uid}/ambientRecordings/${fileName}`;

  const response = await fetch(entry.uri);
  const blob = await response.blob();
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, {
    contentType: `audio/${extension}`
  });

  if (typeof blob?.close === 'function') {
    blob.close();
  }

  const downloadUrl = await getDownloadURL(storageRef);

  const recordRef = await addDoc(collection(db, RECORDING_COLLECTION), {
    userId: user.uid,
    durationMillis: entry.durationMillis || 0,
    storagePath,
    downloadUrl,
    localUri: entry.uri,
    createdAt: serverTimestamp()
  });

  return {
    remoteId: recordRef.id,
    storagePath,
    downloadUrl
  };
}

export function subscribeAmbientRecording(listener) {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}

export function getAmbientRecordingState() {
  return snapshot();
}

export async function startAmbientRecording() {
  if (recordingState.isRecording) return snapshot();

  try {
    await ensurePermission();
    await configureAudioMode();

    recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
    await recorder.prepareToRecordAsync();
    recorder.record();

    setState({
      isRecording: true,
      startedAt: Date.now(),
      durationMillis: 0,
      error: null
    });

    return snapshot();
  } catch (error) {
    recorder = null;
    setState({
      isRecording: false,
      startedAt: null,
      error: error.message || 'Cannot start ambient audio recording.'
    });
    throw error;
  }
}

export async function stopAmbientRecording() {
  if (!recorder || !recordingState.isRecording) return snapshot();

  try {
    await recorder.stop();
    const status = recorder.getStatus();
    const rawDuration = typeof status?.durationMillis === 'number' ? status.durationMillis : 0;
    const fallbackDuration = recordingState.startedAt ? Date.now() - recordingState.startedAt : 0;
    const durationMillis = Math.max(rawDuration, fallbackDuration, 0);
    const uri = recorder.uri || status?.url || null;
    let localEntry = null;

    if (uri) {
      localEntry = createRecordingEntry(uri, durationMillis);
      await appendRecordingHistoryEntry(localEntry);

      try {
        const cloud = await uploadRecordingToCloud(localEntry);
        if (cloud) {
          await updateRecordingHistoryEntry(localEntry.id, {
            synced: true,
            remoteId: cloud.remoteId,
            downloadUrl: cloud.downloadUrl,
            storagePath: cloud.storagePath
          });
        }
      } catch (uploadError) {
        console.warn('Recording upload failed:', uploadError.message);
      }
    }

    setState({
      isRecording: false,
      startedAt: null,
      durationMillis,
      lastRecordingUri: uri,
      error: null
    });

    recorder = null;
    return snapshot();
  } catch (error) {
    setState({
      isRecording: false,
      startedAt: null,
      error: error.message || 'Cannot stop ambient audio recording.'
    });
    recorder = null;
    throw error;
  }
}

export async function toggleAmbientRecording() {
  if (recordingState.isRecording) return stopAmbientRecording();
  return startAmbientRecording();
}

export async function getRecordingHistory() {
  const localHistory = await loadRecordingHistory();
  const user = auth.currentUser;

  if (!user?.uid) return [...localHistory];

  try {
    const q = query(
      collection(db, RECORDING_COLLECTION),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const cloudHistory = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: `cloud_${item.id}`,
        remoteId: item.id,
        userId: data.userId,
        uri: data.downloadUrl,
        downloadUrl: data.downloadUrl,
        storagePath: data.storagePath || '',
        durationMillis: data.durationMillis || 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        synced: true
      };
    });

    const cloudRemoteIds = new Set(cloudHistory.map((item) => item.remoteId));
    const unsyncedLocal = localHistory.filter((item) => {
      if (item.userId && item.userId !== user.uid) return false;
      if (!item.remoteId) return true;
      return !cloudRemoteIds.has(item.remoteId);
    });

    return [...cloudHistory, ...unsyncedLocal];
  } catch (error) {
    console.warn('Cloud history load failed:', error.message);
    return [...localHistory];
  }
}

export async function removeRecordingHistoryItem(recordingId) {
  if (recordingId?.startsWith('cloud_')) {
    const remoteId = recordingId.replace('cloud_', '');
    await deleteDoc(doc(db, RECORDING_COLLECTION, remoteId));

    const localHistory = await loadRecordingHistory();
    const nextLocal = localHistory.filter((item) => item.remoteId !== remoteId);
    await saveRecordingHistory(nextLocal);
    return getRecordingHistory();
  }

  const history = await loadRecordingHistory();
  const next = history.filter((item) => item.id !== recordingId);
  await saveRecordingHistory(next);
  return getRecordingHistory();
}

export async function clearRecordingHistory() {
  await saveRecordingHistory([]);

  const user = auth.currentUser;
  if (user?.uid) {
    try {
      const q = query(collection(db, RECORDING_COLLECTION), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map((item) => deleteDoc(doc(db, RECORDING_COLLECTION, item.id))));
    } catch (error) {
      console.warn('Clear cloud recording history failed:', error.message);
    }
  }

  return [];
}
