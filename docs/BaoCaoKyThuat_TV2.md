# BÁO CÁO KỸ THUẬT – THÀNH VIÊN 2
## Dự án: EmergSOS Lite
### Người thực hiện: Thành viên 2 – Firebase / GPS / SOS

---

## 1. Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React Native | 0.76.5 | Nền tảng phát triển ứng dụng di động đa nền tảng |
| Expo | SDK 54 | Bộ công cụ hỗ trợ build, chạy thử, quản lý native module |
| Expo Go | SDK 54.0.0 | Chạy thử app trực tiếp trên điện thoại thật qua QR code |
| Firebase Authentication | v10 (Web SDK) | Xác thực người dùng bằng Email/Password |
| Cloud Firestore | v10 (Web SDK) | Cơ sở dữ liệu NoSQL thời gian thực lưu contact, SOS, báo cáo |
| Expo Location | ~18.0.4 | Lấy tọa độ GPS (latitude/longitude) từ thiết bị |
| React Navigation | v6 | Quản lý điều hướng giữa các màn hình |
| expo-sms | ~12.0.1 | Mở ứng dụng SMS và tự động điền số điện thoại + nội dung |

### 1.1. Lý do chọn Firebase Spark (miễn phí)

Firebase gói Spark cung cấp đủ hạn mức cho bản demo đồ án:
- **Authentication**: Không giới hạn người dùng.
- **Firestore**: 1 GB dung lượng, 50.000 lượt đọc/ngày, 20.000 lượt ghi/ngày.
- **Không cần thẻ tín dụng** để kích hoạt.

---

## 2. Kiến trúc hệ thống

```
Điện thoại người dùng (Expo Go)
        │
        ▼
  React Native App
  ┌─────────────────────────────────┐
  │  src/screens/       (UI)        │
  │  src/navigation/    (routing)   │
  │  src/components/    (dùng lại)  │
  │  src/services/      (logic)     │◄──── Thành viên 2 phụ trách
  │  src/config/firebase.js         │◄──── Thành viên 2 phụ trách
  └─────────────────────────────────┘
        │                    │
        ▼                    ▼
  Firebase Auth        Cloud Firestore
  (Đăng nhập/          (Lưu dữ liệu:
   Đăng ký)             users, contacts,
                         sosEvents,
                         dangerReports)
        │
        ▼
  Expo Location API
  (GPS thiết bị)
```

---

## 3. Thiết kế cơ sở dữ liệu Firestore

Dự án sử dụng **Cloud Firestore** – cơ sở dữ liệu NoSQL theo dạng document/collection. Mỗi document chứa trường `userId` để phân biệt dữ liệu theo từng người dùng.

### 3.1. Collection `users`

Lưu thông tin hồ sơ người dùng sau khi đăng ký.

| Field | Kiểu | Mô tả |
|---|---|---|
| `uid` | string | Trùng với Firebase Auth UID |
| `fullName` | string | Họ tên đầy đủ |
| `email` | string | Email đăng nhập |
| `phone` | string | Số điện thoại |
| `createdAt` | timestamp | Thời điểm tạo tài khoản |

### 3.2. Collection `emergencyContacts`

Lưu danh bạ khẩn cấp của từng người dùng.

| Field | Kiểu | Mô tả |
|---|---|---|
| `userId` | string | UID chủ sở hữu |
| `name` | string | Tên người liên hệ |
| `phone` | string | Số điện thoại |
| `email` | string | Email (có thể để trống) |
| `relationship` | string | Quan hệ: Mẹ, Ba, Bạn... |
| `createdAt` | timestamp | Ngày tạo |
| `updatedAt` | timestamp | Ngày cập nhật gần nhất |

### 3.3. Collection `sosEvents`

Lưu mỗi lần người dùng kích hoạt SOS.

| Field | Kiểu | Mô tả |
|---|---|---|
| `userId` | string | UID người kích hoạt |
| `latitude` | number | Vĩ độ GPS |
| `longitude` | number | Kinh độ GPS |
| `mapUrl` | string | Link Google Maps: `https://maps.google.com/?q=lat,lng` |
| `message` | string | Nội dung tin nhắn cảnh báo đầy đủ |
| `status` | string | `active` khi SOS, `safe` sau khi bấm "Tôi đã an toàn" |
| `createdAt` | timestamp | Thời điểm SOS |
| `endedAt` | timestamp/null | Thời điểm bấm "Tôi đã an toàn" (null nếu chưa) |

### 3.4. Collection `dangerReports`

Lưu các báo cáo điểm nguy hiểm do cộng đồng đóng góp.

| Field | Kiểu | Mô tả |
|---|---|---|
| `userId` | string | UID người báo cáo |
| `latitude` | number | Vĩ độ GPS tại điểm nguy hiểm |
| `longitude` | number | Kinh độ GPS tại điểm nguy hiểm |
| `type` | string | Loại: `dark_area`, `theft_risk`, `harassment`, `empty_road`, `other` |
| `description` | string | Mô tả chi tiết điểm nguy hiểm |
| `upvotes` | number | Số lượt xác nhận (mặc định 0) |
| `createdAt` | timestamp | Ngày báo cáo |

---

## 4. Mô tả cài đặt các chức năng kỹ thuật

### 4.1. Firebase Authentication

**File:** `src/services/authService.js`

Sử dụng Firebase Authentication SDK với phương thức Email/Password.

**Đăng ký tài khoản (`registerUser`):**
1. Gọi `createUserWithEmailAndPassword(auth, email, password)` để tạo user trong Firebase Auth.
2. Gọi `updateProfile(user, { displayName: fullName })` để lưu tên hiển thị.
3. Gọi `setDoc(doc(db, 'users', user.uid), {...})` để lưu hồ sơ đầy đủ vào Firestore.

**Đăng nhập (`loginUser`):**
- Gọi `signInWithEmailAndPassword(auth, email, password)`.
- Firebase tự quản lý session, `auth.currentUser` sẽ có giá trị sau khi đăng nhập.

**Kiểm tra trạng thái đăng nhập:**
- `AppNavigator.js` dùng `onAuthStateChanged(auth, callback)` để lắng nghe thay đổi trạng thái auth và tự động chuyển hướng Home ↔ Login.

### 4.2. Lấy vị trí GPS

**File:** `src/services/locationService.js`

```js
// Xin quyền truy cập vị trí
const { status } = await Location.requestForegroundPermissionsAsync();

// Lấy tọa độ hiện tại
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High
});
// Trả về { latitude, longitude }
```

- Sử dụng `expo-location` với `Accuracy.High` để tối ưu độ chính xác.
- Nếu người dùng từ chối quyền, throw Error thông báo rõ ràng.
- Ứng dụng **không** theo dõi vị trí nền 24/7 (đúng phạm vi bản Lite).

### 4.3. Luồng SOS (SOS Flow)

**File:** `src/services/sosService.js`

Đây là tính năng cốt lõi của ứng dụng, gồm các bước:

```
Người dùng nhấn giữ nút SOS 3 giây
        │
        ▼
getCurrentLocation() → lấy latitude, longitude
        │
        ▼
createMapUrl(lat, lng) → "https://maps.google.com/?q=lat,lng"
        │
        ▼
createSosMessage() → tạo nội dung tin nhắn cảnh báo kèm link, thời gian
        │
        ▼
createSosEvent() → lưu document vào Firestore sosEvents (status: "active")
        │
        ▼
Điều hướng sang SosAlertScreen (hiển thị message)
        │
        ▼
Lấy danh bạ khẩn cấp → sendSosSms(phones, message)
        │
        ▼
Mở ứng dụng SMS trên máy, tự động điền tất cả các số liên hệ khẩn cấp
        │
        ▼
[Tùy chọn] markSosAsSafe() → cập nhật "safe" và tạo SMS thông báo an toàn
```

**Mẫu nội dung tin nhắn SOS:**
```
Tôi đang cần trợ giúp khẩn cấp!

Vị trí hiện tại của tôi:
https://maps.google.com/?q=10.950000,106.820000

Thời gian: 21/05/2026 18:00
Vui lòng liên hệ hoặc đến hỗ trợ tôi sớm nhất có thể.
```

### 4.4. Danh bạ khẩn cấp (CRUD Firestore)

**File:** `src/services/contactService.js`

| Thao tác | Hàm | Firestore API |
|---|---|---|
| Lấy danh sách | `getContactsByUser(userId)` | `getDocs(query(where, orderBy))` |
| Thêm mới | `addContact(userId, contact)` | `addDoc(collection, data)` |
| Cập nhật | `updateContact(contactId, contact)` | `updateDoc(doc, data)` |
| Xóa | `deleteContact(contactId)` | `deleteDoc(doc)` |

Mỗi query đều lọc theo `userId` để đảm bảo người dùng chỉ thấy dữ liệu của chính mình.

### 4.5. Báo cáo điểm nguy hiểm

**File:** `src/services/dangerReportService.js`

- `addDangerReport()`: Lấy GPS hiện tại + loại nguy hiểm + mô tả → lưu vào Firestore.
- `getDangerReports()`: Lấy toàn bộ báo cáo của cộng đồng, sắp xếp mới nhất lên đầu.
- Bản Lite hiển thị dạng **list** thay vì bản đồ tương tác để đảm bảo ổn định khi demo.

---

## 5. Security Rules Firestore

Áp dụng nguyên tắc **least privilege** – mỗi user chỉ đọc/ghi dữ liệu của chính mình:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // users: chỉ chính user đó mới đọc/ghi được
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    // emergencyContacts, sosEvents: chỉ chủ sở hữu
    match /emergencyContacts/{docId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
    // dangerReports: mọi user đọc được, chỉ chủ mới sửa/xóa
    match /dangerReports/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 6. Composite Index Firestore

Các truy vấn dùng `where('userId', '==', ...)` kết hợp `orderBy('createdAt', 'desc')` yêu cầu **Composite Index**. Đã khai báo trong file `firestore.indexes.json`:

| Collection | Index |
|---|---|
| `emergencyContacts` | `userId` ASC + `createdAt` DESC |
| `sosEvents` | `userId` ASC + `createdAt` DESC |
| `dangerReports` | `userId` ASC + `createdAt` DESC |
| `dangerReports` | `createdAt` DESC (cho query toàn bộ) |

> **Lưu ý khi chạy lần đầu:** Nếu Firebase báo lỗi "index required", bấm vào link trong thông báo lỗi để tạo index tự động trên Firebase Console.

---

## 7. Bảng kiểm thử kỹ thuật

| Mã | Chức năng | Cách kiểm thử | Kết quả đạt |
|---|---|---|---|
| T01 | Đăng ký | Nhập họ tên/email/phone/password hợp lệ | Tạo user Auth + document trong `users` |
| T02 | Đăng nhập | Nhập email/password đúng | Vào màn hình Home |
| T03 | Đăng nhập lỗi | Nhập sai mật khẩu | Hiện thông báo lỗi, không crash |
| T04 | Thêm liên hệ | Thêm Mẹ / 09xxxxxxxx / Mẹ | Contact xuất hiện trong danh sách |
| T05 | Xóa liên hệ | Xóa một contact | Contact biến mất khỏi Firestore và list |
| T06 | Lấy vị trí | Bấm lấy vị trí | Có latitude/longitude hoặc báo lỗi quyền |
| T07 | SOS | Nhấn giữ SOS 3 giây | Tạo message, mở trình SMS điền sẵn số ĐT |
| T08 | Báo An toàn | Bấm "Tôi đã an toàn" | Đổi trạng thái, mở trình SMS báo an toàn |
| T09 | Lịch sử SOS | Vào màn hình lịch sử | Hiển thị event mới nhất, đúng user |
| T10 | Tôi đã an toàn | Bấm nút | Event chuyển `safe`, `endedAt` có giá trị |
| T11 | Fake Call | Chọn 5 giây và Start | Sau 5 giây hiện màn hình cuộc gọi giả |
| T12 | Danger Report | Báo cáo điểm nguy hiểm | Firestore có document mới trong `dangerReports` |
| T13 | Đăng xuất | Bấm đăng xuất | Quay về màn hình Login |

---

## 8. Hạn chế và hướng phát triển tương lai

### 8.1. Hạn chế của bản Lite

| Hạn chế | Lý do |
|---|---|
| Không theo dõi vị trí nền 24/7 | Khó xin quyền, hao pin, dễ lỗi trên thiết bị thật |
| Không gửi SMS tự động ngầm 100% | OS iOS/Android cấm gửi ngầm không qua xác nhận. Giải pháp hiện tại là điền sẵn SMS để người dùng tự bấm Gửi. |
| Không push notification | Cần Firebase Cloud Messaging + server xử lý |
| Danger Map dạng list, không phải bản đồ | `react-native-maps` phụ thuộc vào Google Maps API Key có thể phát sinh chi phí |

### 8.2. Hướng phát triển tương lai

- Gửi SMS tự động qua API khi có kinh phí.
- Push notification trực tiếp cho người thân đã cài app.
- Theo dõi vị trí realtime chỉ trong thời gian SOS đang `active`.
- Ghi âm khẩn cấp có xin quyền rõ ràng từ người dùng.
- Xác minh điểm nguy hiểm bằng cơ chế upvote cộng đồng.
- Tích hợp smartwatch hoặc nút bấm Bluetooth.
- Phân tích rủi ro khu vực dựa trên dữ liệu báo cáo tập thể.
