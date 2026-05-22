import { Platform } from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBai1HNn5mFdN-TpSFfysy4VZRcFbDZTz8',
  authDomain: 'emergsoslite.firebaseapp.com',
  projectId: 'emergsoslite',
  storageBucket: 'emergsoslite.firebasestorage.app',
  messagingSenderId: '1031016636784',
  appId: '1:1031016636784:web:22d2fe644fafd155b8afb5'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;

try {
  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
  } else {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
