# Kế hoạch Tích hợp Nhạc nền (Background Music) và Nút Điều khiển mượt mà

Kế hoạch này mô tả cách tích hợp nhạc nền (BGM) du dương vào thiệp mời tốt nghiệp, tự động kích hoạt ngay khi mở phong bì và cung cấp nút điều khiển Tắt/Bật nhạc tinh tế trên giao diện.

## Đề xuất Thay đổi

Chúng ta sẽ nâng cấp thư viện âm thanh `audio.ts`, chỉnh sửa component cha `page.tsx` để thêm nút điều khiển, và cập nhật `EnvelopeAnimation.tsx` để kích hoạt phát nhạc.

### 1. [MODIFY] [audio.ts](file:///d:/Projects/invite/src/lib/audio.ts)
* Sử dụng thẻ `Audio` của HTML5 để phát nhạc nền nhằm tối ưu bộ nhớ stream cho file nhạc dài.
* Sử dụng link nhạc Piano không bản quyền du dương, chất lượng cao làm mặc định:
  `https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3`
* Bổ sung các phương thức điều khiển nhạc nền trong class `SoundEffects`:
  - `playBGM()`: Khởi tạo, bật phát nhạc nền tự động lặp lại (`loop = true`), âm lượng nhỏ dễ chịu (`volume = 0.25`), và có hiệu ứng tăng âm lượng từ từ (fade-in) trong 1.5 giây để tránh giật mình.
  - `toggleBGM()`: Chuyển đổi giữa chế độ Phát (Play) và Tạm dừng (Pause), trả về trạng thái phát mới (`true` = đang phát, `false` = đã tắt) để đồng bộ với giao diện nút.
  - `isBGMPlaying()`: Trả về trạng thái nhạc đang phát hay dừng.

### 2. [MODIFY] [EnvelopeAnimation.tsx](file:///d:/Projects/invite/src/components/EnvelopeAnimation.tsx)
* Gọi `sfx.playBGM()` ngay khi người dùng nhấn mở con dấu sáp vàng. Vì đây là hành động tương tác trực tiếp của người dùng, trình duyệt sẽ cho phép phát âm thanh hợp lệ (bypass chính sách chặn tự phát autoplay).

### 3. [MODIFY] [page.tsx](file:///d:/Projects/invite/src/app/page.tsx)
* Thêm State `isMuted` để theo dõi trạng thái âm thanh.
* Khi phong bì đã mở (`envelopeState !== "showing"`), hiển thị một nút điều khiển nhạc nền (Music Toggle Button) ở góc trên bên phải màn hình (`fixed top-6 right-6 z-50` hoặc góc dưới bên trái).
* **Thiết kế nút nhạc Premium**:
  - Nút tròn chất liệu kính mờ (glassmorphism), viền nhũ vàng mảnh, phát sáng nhẹ.
  - Khi nhạc phát: Nốt nhạc xoay tròn chậm rãi kèm hiệu ứng sóng âm (wave rings) lan tỏa nhấp nháy.
  - Khi tắt nhạc: Icon nốt nhạc có gạch chéo mờ và đứng yên.
  - Nhấp vào nút sẽ kích hoạt `sfx.toggleBGM()` và cập nhật lại State của nút.

---

## Kế hoạch Xác minh

### Xác minh Thiết bị & Trình duyệt
1. Truy cập `http://localhost:3000` (hoặc cổng dev đang chạy).
2. Nhập tên và nhấp vào con dấu sáp vàng để mở phong bì.
3. Xác nhận xem nhạc nền piano nhẹ nhàng có tự động vang lên ngay khi con dấu tan rã hay không.
4. Khi chuyển sang thiệp mời chính:
   - Kiểm tra xem nút nhạc tròn có xuất hiện ở góc trên bên phải (hoặc vị trí định sẵn) và xoay tròn nhịp nhàng cùng các sóng âm tỏa ra không.
   - Nhấp vào nút nhạc để tắt nhạc, xác nhận xem nhạc có dừng và icon có hiển thị trạng thái tắt không.
   - Nhấp lại để bật nhạc, xác nhận xem nhạc có phát tiếp từ vị trí tạm dừng không.
