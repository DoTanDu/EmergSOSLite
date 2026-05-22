# 🎙️ Kịch Bản Thuyết Trình: EmergSOS Lite

**Thời gian dự kiến:** 10 - 15 phút
**Người trình bày:** Nhật Long (UI/UX, Tính năng mở rộng) & Tấn Du (Core Backend, System)

---

## 1. MỞ ĐẦU (Nhật Long)
*(Slide 1 & 2 - Giới thiệu và Ý tưởng)*
**Long:** "Dạ em chào Thầy/Cô. Nhóm chúng em gồm em là Nhật Long và bạn Tấn Du. Hôm nay nhóm xin phép trình bày đồ án môn học: Ứng dụng an toàn cá nhân **EmergSOS Lite**."
"Ý tưởng xuất phát từ thực trạng nhiều sinh viên phải đi học, đi làm thêm về khuya. Khi gặp sự cố khẩn cấp, họ cần một cách nhanh nhất để báo động. Đó là lý do EmergSOS Lite ra đời: Chỉ cần 1 nút bấm để lấy toạ độ GPS, tạo link Google Maps và chuẩn bị sẵn tin nhắn gửi cho người thân."

---

## 2. KIẾN TRÚC & PHÂN CÔNG (Tấn Du)
*(Slide 3 & 4 - Công nghệ và Phân công)*
**Du:** "Về mặt kỹ thuật, ứng dụng được xây dựng bằng hệ sinh thái **React Native** (Expo) để chạy đa nền tảng. Backend tụi em dùng hoàn toàn **Firebase** (gồm Authentication để đăng nhập, Cloud Firestore để lưu dữ liệu realtime, và Cloud Storage để lưu trữ file)."
"Bạn Long phụ trách thiết kế UI/UX, điều hướng Navigation, và các tính năng mở rộng. Còn em (Du) lo phần kết nối Firebase, xử lý logic lấy toạ độ GPS, và tích hợp các module phần cứng như SMS, Audio."

---

## 3. DEMO CHỨC NĂNG CỐT LÕI (Tấn Du cầm máy demo)
*(Slide 5 & 6 - Auth & SOS Alert)*
**Du:** "Sau đây tụi em xin phép Demo trực tiếp trên điện thoại di động để Thầy/Cô có cái nhìn thực tế nhất."
*(Mở App, ở màn hình Đăng nhập)*
"Đầu tiên là hệ thống đăng nhập. Người dùng có thể đăng nhập bằng Email hoặc Google. Mọi thông tin, bao gồm cả Ảnh Đại Diện (Avatar), đều có thể tùy chỉnh trong phần Hồ sơ."

*(Mở màn hình Home)*
"Đây là màn hình chính. Khi rơi vào tình huống nguy hiểm, thao tác duy nhất người dùng cần làm là **Nhấn giữ nút SOS màu đỏ trong 3 giây** (để tránh chạm nhầm)."
*(Bấm giữ SOS)*
"Ngay lập tức, App sẽ âm thầm:
1. Xin toạ độ GPS chính xác.
2. Lưu trạng thái 'Đang gặp nguy hiểm' lên server Firebase.
3. Tạo sẵn một tin nhắn SMS chứa link Google Maps để gửi cho danh bạ khẩn cấp.
Dù người dùng không có kết nối Internet (Offline), tin nhắn SMS này vẫn gửi đi được, đảm bảo khả năng sinh tồn cao nhất."

---

## 4. CÁC TÍNH NĂNG MỞ RỘNG (Nhật Long thao tác)
*(Slide 7, 8, 9 - Ghi âm, Fake Call, Danger Map)*
**Long:** "Bên cạnh SOS, tụi em còn phát triển 3 tính năng hỗ trợ sinh tồn cực kỳ thực tế:"

**1. Ghi âm môi trường (Ambient Recording):** 
*(Bấm thử nút Ghi âm)*
"Khi cảm thấy có người bám theo, người dùng có thể bật ghi âm chạy ngầm. File âm thanh sẽ được lưu làm bằng chứng và đồng bộ thẳng lên **Firebase Cloud Storage**."

**2. Cuộc gọi giả (Fake Call):**
*(Bấm vào Fake Call, hẹn 5 giây)*
"Ví dụ bạn bị ai đó giữ chân, bạn có thể hẹn giờ 5 giây. App sẽ tự giả lập một màn hình cuộc gọi đến hệt như thật, giúp bạn có cớ bắt máy và thoát khỏi tình huống khó xử."

**3. Bản đồ Điểm nguy hiểm (Danger Map):**
*(Mở Danger Map)*
"Nơi cộng đồng có thể báo cáo các đoạn đường hay bị cướp giật, ngập lụt, chó dữ. Thông tin này được cập nhật Realtime qua Firestore."

---

## 5. KẾT LUẬN & HƯỚNG PHÁT TRIỂN (Tấn Du)
*(Slide 10 - Tổng kết)*
**Du:** "Để đảm bảo App chạy ổn định, tụi em đã kiểm thử qua tất cả các luồng, từ lúc chưa có mạng đến lúc có mạng, cấu hình các Rule bảo mật chặt chẽ trên Firebase để dữ liệu của ai thì người nấy xem."
"Dù đây mới là bản Lite, nhưng nó đã giải quyết được trọn vẹn bài toán cốt lõi. Trong tương lai, nhóm dự định tích hợp thêm AI để phân tích âm thanh la hét tự động báo động.
Dạ phần trình bày của nhóm đến đây là hết. Cảm ơn Thầy/Cô đã lắng nghe, tụi em rất mong nhận được góp ý ạ!"
