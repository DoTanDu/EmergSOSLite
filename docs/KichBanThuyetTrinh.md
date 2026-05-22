# 🎙️ Kịch Bản Thuyết Trình Chi Tiết: EmergSOS Lite

**Dự án:** Ứng dụng an toàn cá nhân trong một nút bấm
**Nhóm sinh viên:** Nhật Long (Phụ trách UI/UX, Fake Call, Audio) & Tấn Du (Phụ trách Hệ thống Core, Firebase, GPS)

---

## 1. MỞ ĐẦU & ĐẶT VẤN ĐỀ (Nhật Long)
**Long:** "Dạ em chào Hội đồng Thầy/Cô. Nhóm chúng em gồm em là Nhật Long và bạn Tấn Du. Hôm nay nhóm xin phép trình bày đồ án môn học: Ứng dụng hỗ trợ an toàn cá nhân mang tên **EmergSOS Lite**."

"Ý tưởng của chúng em xuất phát từ một bài toán rất thực tế: Khi một người (đặc biệt là các bạn nữ sinh viên) đi làm thêm về khuya hoặc đi vào những khu vực vắng vẻ, nếu gặp tình huống nguy hiểm thì việc mở khóa điện thoại, vào danh bạ, tìm số người thân và gọi điện là quá mất thời gian, đôi khi là bất khả thi."

"Từ đó, tụi em quyết định xây dựng EmergSOS Lite - một ứng dụng tập trung vào sự tối giản và tính sinh tồn cao nhất: **Chỉ cần một thao tác nhấn giữ duy nhất để tự động hóa toàn bộ quá trình cầu cứu**."

---

## 2. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (Tấn Du)
**Du:** "Dạ để hiện thực hóa ý tưởng đó, nhóm đã lựa chọn công nghệ và thiết kế kiến trúc như sau:"

**Về Frontend:** Tụi em sử dụng **React Native** kết hợp với **Expo SDK**. Điều này giúp ứng dụng có thể build ra cả iOS và Android với cùng một codebase, đồng thời tận dụng được các API gốc của thiết bị một cách mạnh mẽ. Giao diện được thiết kế tối giản, loại bỏ hoàn toàn tính năng cuộn (scroll) ở màn hình chính để tránh việc người dùng vuốt nhầm trong lúc hoảng loạn.

**Về Backend:** Ứng dụng hoàn toàn Serverless (không máy chủ) nhờ sử dụng toàn diện hệ sinh thái **Firebase**:
1. **Firebase Authentication:** Quản lý tài khoản bảo mật bằng Email/Password và đăng nhập nhanh bằng Google.
2. **Cloud Firestore:** Database Realtime dùng để đồng bộ danh bạ khẩn cấp, lịch sử SOS và danh sách các Điểm nguy hiểm.
3. **Cloud Storage:** Dùng để lưu trữ tài nguyên đa phương tiện (Ảnh đại diện người dùng và file ghi âm hiện trường).

---

## 3. DEMO & GIẢI THÍCH TÍNH NĂNG CỐT LÕI (Tấn Du)

**Du:** "Sau đây em xin đi vào chi tiết luồng hoạt động chính của ứng dụng."

### Tính năng SOS & Xử lý Ngoại tuyến (Offline-First)
*(Thao tác: Mở App, nhấn giữ nút màu đỏ 3 giây)*
"Điểm nhấn của màn hình chính là nút SOS khổng lồ. Tụi em thiết kế cơ chế **Nhấn giữ 3 giây** thay vì chạm 1 lần để chống chạm nhầm khi để điện thoại trong túi quần."

"Ngay khi kích hoạt, hệ thống sẽ chạy đa luồng các tác vụ sau:"
1. **Định vị GPS:** Gọi thư viện `expo-location` để lấy vĩ độ, kinh độ với độ chính xác cao nhất.
2. **Đồng bộ Đám mây:** Tạo một sự kiện (Event) trên Firestore với trạng thái `active` để ghi nhận thời điểm gặp nạn.
3. **Cơ chế Cứu hộ Offline (Cực kỳ quan trọng):** Nếu nạn nhân đang ở vùng lõm sóng, không có 3G/4G/Wifi, việc gọi API lên Firebase sẽ thất bại. Nhóm em đã bắt lỗi (catch error) khu vực này và chuyển hướng sang giải pháp fallback: Ứng dụng tự động đóng gói tọa độ GPS thành một đường link Google Maps và nhúng vào tin nhắn SMS gốc của điện thoại. SMS không cần mạng Internet vẫn có thể gửi đi bình thường qua sóng viễn thông."

*(Thao tác: Bấm nút "Tôi đã an toàn")*
"Khi nguy hiểm đã qua, người dùng bấm 'Tôi đã an toàn'. Hệ thống sẽ gọi API cập nhật trạng thái sự kiện trên database thành `safe`, giúp người nhà ở nhà biết nạn nhân đã ổn."

### Danh bạ khẩn cấp
*(Thao tác: Mở Danh bạ khẩn cấp)*
"Danh bạ này được lưu riêng biệt trên Firestore và ánh xạ 1-1 với UID của người dùng (nhờ vào Security Rules), đảm bảo quyền riêng tư tuyệt đối. Khi có sự cố, hệ thống sẽ tự quét danh sách này và tự động điền các số điện thoại vào ứng dụng nhắn tin của hệ thống."

---

## 4. DEMO TÍNH NĂNG MỞ RỘNG - HỖ TRỢ SINH TỒN (Nhật Long)

**Long:** "Dạ ngoài tính năng gửi cảnh báo cốt lõi, em xin phép trình bày 3 tính năng mở rộng mà tụi em thiết kế riêng cho các tình huống ứng phó linh hoạt hơn."

### 1. Ghi âm môi trường (Ambient Recording)
*(Thao tác: Bấm nút Ghi âm màu đen trên màn hình chính)*
"Sẽ có lúc người dùng linh cảm thấy sự bất an (ví dụ có người bám theo) nhưng chưa đến mức phải bấm SOS. Họ có thể bấm nút Ghi âm này. Module `expo-audio` sẽ kích hoạt micro thu âm chạy ngầm. Khi tắt, file âm thanh (`.m4a`) sẽ được lưu vào bộ nhớ trong cục bộ của điện thoại (Local FileSystem)."
"Đặc biệt, hệ thống sẽ tự động đồng bộ file này lên **Firebase Cloud Storage** ở chế độ chạy nền. Ngay cả khi lúc đó không có mạng, file vẫn nằm an toàn trên điện thoại nạn nhân và sẵn sàng làm bằng chứng giao nộp cho cơ quan chức năng sau này."

### 2. Cuộc gọi giả (Fake Call)
*(Thao tác: Bấm Fake Call, chọn 5 giây)*
"Trong các tình huống khó xử như bị làm phiền, ép rượu, hoặc đi xe ôm công nghệ có biểu hiện lạ, nạn nhân cần một 'cái cớ' để thoát thân. Tính năng Fake Call sử dụng cơ chế Timer Timeout (hẹn giờ 5s, 10s, 30s) để gọi lên một màn hình rung chuông giống hệt cuộc gọi điện thoại thật. Nạn nhân có thể bấm nút 'Nghe máy' và giả vờ nói chuyện với người thân để đánh lừa đối tượng xấu."

### 3. Bản đồ Điểm nguy hiểm (Danger Map)
*(Thao tác: Mở Điểm nguy hiểm)*
"Đây là một tính năng cộng đồng (Crowdsourcing). Bất cứ ai phát hiện khu vực thường xuyên xảy ra cướp giật, ngập nước hay có sàm sỡ đều có thể thêm cảnh báo (Report) kèm GPS. Thông tin này sẽ chia sẻ Realtime cho tất cả những người dùng khác trong hệ thống để họ chủ động né tránh."

### 4. Cập nhật hồ sơ & Avatar
*(Thao tác: Mở Hồ sơ)*
"Ở phần quản lý tài khoản, người dùng có thể tự cập nhật Ảnh đại diện. Tụi em dùng thư viện `ImagePicker` để truy cập thư viện ảnh của thiết bị, nén ảnh lại và đẩy lên Cloud Storage, sau đó lấy link URL cập nhật ngược lại vào Firebase Auth (Profile) và Firestore."

---

## 5. TỔNG KẾT & HƯỚNG PHÁT TRIỂN (Tấn Du)

**Du:** "Dạ để kết luận, **EmergSOS Lite** dù là một dự án quy mô nhỏ, nhưng tụi em đã cố gắng giải quyết bài toán một cách thực tế và triệt để nhất, đặc biệt là tư duy xử lý 'Offline-first' (Không có mạng vẫn phải hoạt động được) và tối ưu giao diện 'No-scroll' (Tránh thao tác lỗi khi hoảng loạn)."

"Về hướng phát triển nếu có thời gian, nhóm dự định sẽ:
1. Áp dụng Machine Learning/AI để nhận diện tiếng hét hoặc âm thanh va chạm (như tiếng vỡ kính, phanh xe) để tự động kích hoạt SOS mà không cần chạm vào màn hình.
2. Thiết kế ứng dụng Companion chạy trên Đồng hồ thông minh (Apple Watch / WearOS).

"Dạ bài thuyết trình và phần Demo của nhóm em đến đây là kết thúc. Chúng em xin cảm ơn Quý Thầy/Cô đã lắng nghe và rất mong nhận được những câu hỏi phản biện để hoàn thiện ứng dụng hơn ạ!"
