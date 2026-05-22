import { Platform } from 'react-native';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { googleOAuthConfig } from '../config/googleOAuth';

// Cần gọi để Expo tự xử lý redirect khi đăng nhập xong
WebBrowser.maybeCompleteAuthSession();

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

// Web: dùng Firebase popup
export async function loginWithGoogleWeb() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    await saveUserProfile(credential.user, { provider: 'google' });
    return credential.user;
  } catch (error) {
    throw new Error(normalizeAuthError(error));
  }
}

// Điện thoại: dùng expo-auth-session + Firebase credential
export async function loginWithGoogleNative(promptAsync) {
  try {
    const result = await promptAsync();

    if (result?.type !== 'success') {
      if (result?.type === 'cancel' || result?.type === 'dismiss') {
        throw new Error('Bạn đã huỷ đăng nhập Google.');
      }
      throw new Error('Đăng nhập Google thất bại.');
    }

    const { id_token } = result.params;
    if (!id_token) throw new Error('Không nhận được token từ Google.');

    const googleCredential = GoogleAuthProvider.credential(id_token);
    const userCredential = await signInWithCredential(auth, googleCredential);

    await saveUserProfile(userCredential.user, { provider: 'google' });
    return userCredential.user;
  } catch (error) {
    if (error.message.includes('huỷ') || error.message.includes('thất bại') || error.message.includes('token')) {
      throw error;
    }
    throw new Error(normalizeAuthError(error));
  }
}

// Hook để dùng trong component (điện thoại + web)
export function useGoogleAuth() {
  const webClientId = googleOAuthConfig.webClientId;
  const iosClientId = googleOAuthConfig.iosClientId;

  // expo-auth-session tự tạo redirect URI đúng dựa vào iosClientId
  // Scheme: com.googleusercontent.apps.<client_id>
  return Google.useAuthRequest({
    webClientId,
    androidClientId: googleOAuthConfig.androidClientId || webClientId,
    iosClientId,
    scopes: ['profile', 'email']
  });
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
