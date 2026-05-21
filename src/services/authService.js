import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function registerUser({ fullName, email, phone, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;

  await updateProfile(user, { displayName: fullName.trim() });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    createdAt: serverTimestamp()
  });

  return user;
}

export async function loginUser({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, 'users', user.uid));
  return snap.exists() ? snap.data() : null;
}
