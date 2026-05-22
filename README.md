# 🚨 EmergSOS Lite - Ứng Dụng Sinh Tồn Khẩn Cấp

**EmergSOS Lite** là ứng dụng di động hỗ trợ an toàn cá nhân, giúp người dùng gửi thông báo khẩn cấp kèm toạ độ GPS chính xác và cập nhật các điểm nguy hiểm xung quanh theo thời gian thực.

---

## 🌟 Các Tính Năng Nổi Bật

- **Gửi cảnh báo SOS tự động:** Tự động lấy toạ độ GPS và mở trình nhắn tin (SMS) để gửi link Google Maps ngay lập tức.
- **Hoạt động Offline (Ngoại tuyến):** Tính năng SOS độc lập với Firebase, đảm bảo vẫn gửi được SMS cứu trợ kể cả khi không có mạng Internet.
- **Bản đồ Điểm Nguy Hiểm (Danger Map):** Cộng đồng cùng đóng góp (Crowdsource) các vị trí rủi ro. Có tính năng kiểm duyệt (Report Spam).
- **Ghi âm khẩn cấp (Ambient Recording):** Chạy ngầm và tự động tải file âm thanh làm bằng chứng lên Cloud Storage.
- **Cuộc gọi giả (Fake Call):** Lên lịch đổ chuông như cuộc gọi thật để thoát khỏi tình huống khó xử.
- **Tài khoản & Hồ sơ cá nhân:** Xác thực đa nền tảng, cho phép chỉnh sửa Avatar và thông tin liên hệ.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** React Native, Expo SDK 54, React Navigation
- **Backend:** Firebase Authentication, Cloud Firestore (Realtime Database), Firebase Cloud Storage
- **APIs/Libraries:** Expo Location, Expo Audio, Expo SMS, Native Intent (Mail/Call)
- **UI Design:** Flexbox, SafeAreaContext, Vector Icons

---

## 🚀 Hướng Dẫn Cài Đặt (Installation)

### Yêu cầu hệ thống:

- Đã cài đặt [Node.js](https://nodejs.org/) (Khuyên dùng bản LTS).
- Cài đặt ứng dụng **Expo Go** trên thiết bị di động (iOS/Android).

### Các bước chạy dự án:

1. **Clone dự án về máy:**

   ```bash
   git clone https://github.com/DoTanDu/EmergSOSLite.git
   cd EmergSOSLite
   ```
2. **Cài đặt thư viện (Dependencies):**

   ```bash
   npm install
   ```
3. **Khởi động Server:**

   ```bash
   npx expo start -c
   ```

   *(Để chia sẻ dự án cho máy khác mạng Wi-Fi, hãy dùng lệnh `npx expo start --tunnel`)*
4. **Trải nghiệm App:** Mở ứng dụng Camera (iPhone) hoặc Expo Go (Android) và quét mã QR hiện ra trên màn hình Terminal.

---

## 👥 Thành Viên Nhóm

- **Nguyễn Nhật Long** - Trưởng nhóm Frontend/UI (MSSV: 123000684)
- **Đỗ Tấn Du** - Kỹ sư Backend/Hệ thống (MSSV: 123001364)

> *Dự án được thực hiện nhằm mục đích học thuật và báo cáo đồ án môn học.*
