import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBai1HNn5mFdN-TpSFfysy4VZRcFbDZTz8',
  authDomain: 'emergsoslite.firebaseapp.com',
  projectId: 'emergsoslite',
  storageBucket: 'emergsoslite.firebasestorage.app',
  messagingSenderId: '1031016636784',
  appId: '1:1031016636784:web:22d2fe644fafd155b8afb5'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
