# Firestore Collections

## users

| Field | Type | Ghi chú |
|---|---|---|
| uid | string | Trùng Firebase Auth uid |
| fullName | string | Họ tên người dùng |
| email | string | Email đăng nhập |
| phone | string | Số điện thoại |
| createdAt | timestamp | Ngày tạo |

## emergencyContacts

| Field | Type | Ghi chú |
|---|---|---|
| userId | string | Chủ sở hữu contact |
| name | string | Tên liên hệ |
| phone | string | Số điện thoại |
| email | string | Có thể trống |
| relationship | string | Mẹ, ba, bạn... |
| createdAt | timestamp | Ngày tạo |
| updatedAt | timestamp | Ngày cập nhật |

## sosEvents

| Field | Type | Ghi chú |
|---|---|---|
| userId | string | Người kích hoạt SOS |
| latitude | number | Vĩ độ |
| longitude | number | Kinh độ |
| mapUrl | string | Link Google Maps |
| message | string | Nội dung cảnh báo |
| status | string | active/safe |
| createdAt | timestamp | Thời điểm SOS |
| endedAt | timestamp/null | Thời điểm an toàn |

## dangerReports

| Field | Type | Ghi chú |
|---|---|---|
| userId | string | Người báo cáo |
| latitude | number | Vĩ độ |
| longitude | number | Kinh độ |
| type | string | dark_area/theft_risk/harassment/empty_road/other |
| description | string | Mô tả |
| upvotes | number | Mặc định 0 |
| createdAt | timestamp | Ngày tạo |

## recordingEvents

| Field | Type | Ghi chú |
|---|---|---|
| userId | string | Người ghi âm |
| durationMillis | number | Thời lượng ghi âm (ms) |
| storagePath | string | Đường dẫn file trên Firebase Storage |
| downloadUrl | string | Link tải audio |
| localUri | string | Đường dẫn nội bộ trên máy |
| createdAt | timestamp | Thời điểm tạo |
