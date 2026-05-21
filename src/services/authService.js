import { Platform } from 'react-native';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

function normalizeAuthError(error) {
  const code = error?.code || '';

  if (code.includes('auth/email-already-in-use')) return 'Email này đã được đăng ký.';
  if (code.includes('auth/invalid-email')) return 'Email không hợp lệ.';
  if (code.includes('auth/weak-password')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (code.includes('auth/user-not-found')) return 'Không tìm thấy tài khoản.';
  if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) return 'Email hoặc mật khẩu không đúng.';
  if (code.includes('auth/popup-closed-by-user')) return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  if (code.includes('auth/popup-blocked')) return 'Trình duyệt đang chặn popup Google. Hãy cho phép popup cho localhost.';
  if (code.includes('auth/operation-not-allowed')) return 'Firebase chưa bật phương thức đăng nhập Google.';

  return error?.message || 'Có lỗi Firebase Auth.';
}

async function saveUserProfile(user, extra = {}) {
  const payload = {
    uid: user.uid,
    fullName: extra.fullName || user.displayName || 'Người dùng',
    displayName: extra.fullName || user.displayName || 'Người dùng',
    email: user.email || '',
    phone: extra.phone || '',
    avatarUrl: extra.avatarUrl || user.photoURL || '',
    provider: extra.provider || 'password',
    updatedAt: serverTimestamp()
  };

  if (extra.createdAt) payload.createdAt = extra.createdAt;

  await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
}

export async function registerUser({ fullName, email, phone, password }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    await updateProfile(user, { displayName: fullName.trim() });

    await saveUserProfile(user, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      provider: 'password',
      createdAt: serverTimestamp()
    });

    return user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function loginUser({ email, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function loginWithGoogleWeb() {
  try {
    if (Platform.OS !== 'web') {
      throw new Error('Google Login bản hiện tại ưu tiên chạy trên web demo. Trên điện thoại cần cấu hình OAuth Client ID native.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const credential = await signInWithPopup(auth, provider);
    await saveUserProfile(credential.user, { provider: 'google' });

    return credential.user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, 'users', user.uid));
  const firestoreData = snap.exists() ? snap.data() : {};

  return {
    uid: user.uid,
    fullName: firestoreData.fullName || firestoreData.displayName || user.displayName || 'Người dùng',
    displayName: firestoreData.displayName || firestoreData.fullName || user.displayName || 'Người dùng',
    email: firestoreData.email || user.email || '',
    phone: firestoreData.phone || '',
    avatarUrl: firestoreData.avatarUrl || user.photoURL || '',
    provider: firestoreData.provider || (user.providerData?.[0]?.providerId || 'password')
  };
}

export async function updateUserProfile({ displayName, fullName, phone, avatarUrl }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Bạn chưa đăng nhập.');

  const name = (displayName || fullName || '').trim();
  if (!name) throw new Error('Tên hiển thị không được để trống.');

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName: name,
    displayName: name,
    email: user.email || '',
    phone: phone?.trim() || '',
    avatarUrl: avatarUrl || '',
    updatedAt: serverTimestamp()
  }, { merge: true });

  return getCurrentUserProfile();
}
