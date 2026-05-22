# Báo Cáo Phân Công Công Việc - EmergSOS Lite

Dưới đây là chi tiết phân công công việc và mức độ hoàn thành của từng thành viên trong nhóm cho đồ án ứng dụng EmergSOS Lite.

---

## 👨‍💻 Thành viên 1: Nguyễn Nhật Long (MSSV: 123000684)
**Vai trò:** Trưởng nhóm Frontend / Phát triển Giao diện (UI/UX)

**Các hạng mục đã hoàn thành (100%):**
- Thiết lập hệ thống điều hướng (App Navigation).
- Xây dựng luồng giao diện người dùng: Đăng nhập (Login), Đăng ký (Register), Màn hình chính (Home), Danh bạ khẩn cấp (Contacts).
- Thiết kế UI cho màn hình SOS Alert, Lịch sử SOS, Danger Map/List.
- Phát triển tính năng Fake Call (Cuộc gọi giả) và Incoming Fake Call UI.
- Xây dựng các Component tái sử dụng được (Reusable UI components).
- Xử lý kiểm tra dữ liệu đầu vào (Form validation), trạng thái tải (Loading state), hộp thoại cảnh báo (Alerts).
- Viết hiệu ứng giữ nút SOS 3 giây (Press-and-hold UI).
- Rà soát toàn bộ giao diện và việt hoá văn bản.

---

## 👨‍💻 Thành viên 2: Đỗ Tấn Du (MSSV: 123001364)
**Vai trò:** Kỹ sư Backend / Tích hợp Hệ thống (Firebase & Native Services)

**Các hạng mục đã hoàn thành (100%):**
- Cấu hình toàn bộ cơ sở hạ tầng Firebase.
- Xây dựng hệ thống Xác thực người dùng (Auth service) bao gồm Google OAuth.
- Lập trình CRUD (Thêm, Sửa, Xoá) cho danh bạ khẩn cấp trên Firestore.
- Xử lý phân quyền vị trí (Location permission) và đọc toạ độ GPS.
- Viết logic tạo tin nhắn SOS, lấy link Google Maps, và lưu sự kiện SOS lên Firestore.
- Xử lý tính năng Share sheet và SMS Fallback (Gắn link gửi SMS khi Offline).
- Viết truy vấn lấy Lịch sử SOS và chức năng "Đánh dấu an toàn".
- Lập trình tính năng bản đồ điểm nguy hiểm (Danger report service) và Report Spam.
- Cấu hình bảo mật Firestore Rules và Indexes.

---

## 📋 Checklist Kiểm Tra (Demo Checklist)

- [x] Đăng ký / Đăng nhập
- [x] Thêm số điện thoại người thân
- [x] Nhấn giữ nút SOS trong 3 giây
- [x] Cấp quyền GPS và lấy toạ độ
- [x] Gửi SMS cảnh báo SOS ngầm (hoặc qua trình nhắn tin)
- [x] Đánh dấu an toàn
- [x] Xem lịch sử SOS
- [x] Demo cuộc gọi giả (Fake Call)
- [x] Thêm điểm nguy hiểm lên bản đồ
- [x] Báo cáo điểm nguy hiểm giả (Spam)
