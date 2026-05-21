# Google Login, avatar và chỉnh sửa hồ sơ

## Chức năng đã hoàn thiện

- Đăng nhập bằng Google trên web demo bằng Firebase Google Popup.
- Hồ sơ hiển thị ảnh đại diện, tên hiển thị, email, số điện thoại và kiểu đăng nhập.
- Người dùng có thể chọn ảnh đại diện từ thư viện ảnh.
- Người dùng có thể sửa tên hiển thị và số điện thoại.
- Dữ liệu được lưu vào Firestore collection `users`.
- Firebase Auth được cập nhật `displayName`.

## Cần bật trong Firebase Console

1. Vào Firebase Console.
2. Chọn project `emergsoslite`.
3. Vào Authentication > Sign-in method.
4. Bật provider Google.
5. Lưu lại.

## Demo

```bash
npx expo start -c
```

- Bấm `w` để demo trên web.
- Quét QR bằng Expo Go để demo trên điện thoại.
- Google Login hiện ưu tiên demo trên web.
