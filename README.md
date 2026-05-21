# EmergSOS Lite - Khung project Expo/React Native

Khung này được dựng theo file phân công công việc nhóm 2 người: **Thành viên 1 làm UI/navigation**, **Thành viên 2 làm Firebase/GPS/SOS/service**.

## 1. Công nghệ

- React Native + Expo
- Expo Go để chạy demo trên điện thoại
- Firebase Authentication Email/Password
- Cloud Firestore
- Expo Location để lấy GPS
- React Navigation để chuyển màn hình

## 2. Cài đặt nhanh

```bash
npm install
npx expo start
```

Nếu muốn tạo project Expo mới sạch rồi copy source vào:

```bash
npx create-expo-app@latest --template default@sdk-55 EmergSOSLite
cd EmergSOSLite
npm install firebase @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context expo-location expo-sharing expo-linking react-native-maps
```

Sau đó copy thư mục `src`, file `App.js`, `app.json` từ khung này sang project mới.

## 3. Việc cần làm ngay sau khi tải project

1. Vào Firebase Console, tạo project Firebase.
2. Bật Authentication > Sign-in method > Email/Password.
3. Tạo Cloud Firestore ở chế độ test để demo ban đầu.
4. Mở `src/config/firebase.js` và thay toàn bộ `YOUR_*` bằng config thật.
5. Chạy `npx expo start`, quét QR bằng Expo Go.

## 4. Cấu trúc thư mục

```txt
EmergSOSLite/
|-- App.js
|-- app.json
|-- package.json
|-- src/
|   |-- config/
|   |   |-- firebase.js
|   |-- navigation/
|   |   |-- AppNavigator.js
|   |-- screens/
|   |   |-- LoginScreen.js
|   |   |-- RegisterScreen.js
|   |   |-- HomeScreen.js
|   |   |-- ContactsScreen.js
|   |   |-- AddContactScreen.js
|   |   |-- SosAlertScreen.js
|   |   |-- SosHistoryScreen.js
|   |   |-- FakeCallScreen.js
|   |   |-- IncomingFakeCallScreen.js
|   |   |-- DangerMapScreen.js
|   |   |-- AddDangerReportScreen.js
|   |   |-- ProfileScreen.js
|   |-- services/
|   |   |-- authService.js
|   |   |-- contactService.js
|   |   |-- sosService.js
|   |   |-- locationService.js
|   |   |-- dangerReportService.js
|   |-- components/
|   |   |-- PrimaryButton.js
|   |   |-- SosButton.js
|   |   |-- ContactCard.js
|   |   |-- HistoryCard.js
|   |   |-- DangerReportCard.js
|   |-- constants/
|   |   |-- colors.js
|   |   |-- appText.js
|   |-- utils/
|       |-- formatDate.js
|       |-- createMapUrl.js
|       |-- validators.js
```

## 5. Chia việc theo đúng file phân công

### Thành viên 1 - Frontend/UI

- Sửa giao diện trong `src/screens/*`.
- Sửa component dùng lại trong `src/components/*`.
- Polish màu sắc, spacing, loading, alert.
- Chụp screenshot màn hình để đưa vào báo cáo/slide.

### Thành viên 2 - Firebase/GPS/SOS

- Cấu hình `src/config/firebase.js`.
- Hoàn thiện service trong `src/services/*`.
- Test Auth, Firestore CRUD, GPS, SOS event, share message.
- Viết phần database/logic kỹ thuật cho báo cáo.

## 6. Luồng demo bắt buộc

1. Register tài khoản.
2. Login.
3. Thêm ít nhất 1 emergency contact.
4. Về Home, nhấn giữ SOS 3 giây.
5. App lấy GPS và tạo event Firestore.
6. Màn hình SOS Alert hiện message + link Google Maps.
7. Bấm chia sẻ cảnh báo.
8. Bấm Tôi đã an toàn.
9. Vào SOS History kiểm tra trạng thái đã đổi sang `safe`.
10. Demo Fake Call và Danger Report nếu còn thời gian.

## 7. Lưu ý kỹ thuật

- Firestore query có `orderBy('createdAt')` có thể yêu cầu tạo index. Nếu Firebase báo cần index, bấm link Firebase gợi ý để tạo.
- Bản Lite dùng Share API của React Native để chia sẻ text, không tự động gửi SMS để tránh phát sinh phí.
- Danger Map đang để dạng list dự phòng. Nếu `react-native-maps` ổn thì thay màn hình `DangerMapScreen.js` bằng map marker.
- Khi core chưa xong, bỏ bonus trước: Danger Map > Fake Call.
