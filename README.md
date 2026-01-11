# 💪 Tracking Fitness App

Một ứng dụng theo dõi tập luyện hiện đại, được thiết kế tối ưu cho mobile với giao diện đơn giản, dễ sử dụng. Xây dựng bằng **Next.js 14**, **React 18**, và **Node.js** với lưu trữ dữ liệu JSON.

> **Mục đích**: Giúp bạn theo dõi các buổi tập, ghi chép tiến độ, đánh dấu những ngày tập nặng, và viết nhật ký tập luyện.

---

## 📋 Giới Thiệu App

**Tracking Fitness** là một ứng dụng web nhẹ, không cần cơ sở dữ liệu phức tạp, lưu tất cả dữ liệu dưới dạng JSON. Ứng dụng tập trung vào:

- **Đơn giản & Hiệu quả**: Ghi lại weight, reps cho mỗi set
- **Theo dõi tiến độ**: So sánh với buổi tập trước, buổi tập nặng nhất
- **Ghi chú buổi tập**: Viết nhật ký cho từng bài tập mỗi buổi
- **Chế độ sáng/tối**: Giao diện thân thiện với mắt ở cả hai chế độ
- **Mobile-first**: Thiết kế tối ưu cho điện thoại (iPhone, Android)

---

## ✨ Tính Năng Chi Tiết

### 1. **Quản Lý Workout (Bài Tập)**
- ✅ Tạo workout mới với tên tùy ý
- ✅ Thêm bài tập (exercise) vào workout
- ✅ Định nghĩa số set × reps cho mỗi bài
- ✅ Thêm mô tả (description), thời gian nghỉ (rest time)
- ✅ Ghi chú RPE (Rate of Perceived Exertion): 1-10
- ✅ Ghi chú tempo (ví dụ: 3-1-2-0)
- ✅ Chỉnh sửa/xóa workout
- ✅ Xem danh sách tất cả workout

### 2. **Ghi Nhận Tracking (Theo Dõi Buổi Tập)**
- ✅ Nhập weight (kg) và reps cho từng set
- ✅ Lưu từng set một hoặc lưu hết một lần
- ✅ Chỉnh sửa buổi tập trước (có thể để trống set, chỉ save những set có dữ liệu)
- ✅ Xem buổi tập trước và so sánh
- ✅ Đánh dấu buổi tập là "Heavy Day" (ngày tập nặng)
- ✅ Xem buổi tập nặng nhất (heavy day) của exercise đó

### 3. **Ghi Chú Buổi Tập (Session Notes)**
- ✅ Viết ghi chú cho từng bài tập mỗi buổi tập
- ✅ Ghi chú tự động được điền lại từ buổi tập trước
- ✅ Có thể chỉnh sửa ghi chú khi edit buổi tập trước
- ✅ Ghi chú được lưu cùng với tracking data

### 4. **Xác Thực & Bảo Mật**
- ✅ Đăng ký tài khoản (register)
- ✅ Đăng nhập (login)
- ✅ JWT token authentication
- ✅ Session management (localStorage)
- ✅ Đăng xuất (logout)

### 5. **Giao Diện & UX**
- ✅ Chế độ sáng (light mode) - mặc định
- ✅ Chế độ tối (dark mode) - mềm mại, không bị lóa mắt
- ✅ Responsive design cho tất cả kích thước màn hình
- ✅ Smooth animations & transitions
- ✅ Loading states & error messages
- ✅ Thông báo thành công/lỗi
- ✅ Giao diện mobile-first (tối ưu iPhone 390px)

### 6. **Tính Năng Khác**
- ✅ Lịch sử tracking đầy đủ (xem toàn bộ buổi tập trước đó)
- ✅ So sánh hiệu suất (last session vs current)
- ✅ Xem heavy day mới nhất cho mỗi bài tập
- ✅ Theme toggle (chuyển đổi sáng/tối)
- ✅ Responsive layout trên mọi thiết bị

---

## 🎯 Hướng Dẫn Sử Dụng

### Bước 1: Đăng Ký / Đăng Nhập
1. Truy cập ứng dụng
2. Nhấn **"Create Account"** để tạo tài khoản mới
3. Hoặc **"Login"** nếu đã có tài khoản
4. Nhập email và password

### Bước 2: Tạo Workout Mới
1. Ở trang chính (Home), nhấn **"Create a new workout"**
2. Nhập tên workout (ví dụ: "Chest Day", "Leg Day")
3. Nhấn **"+ Add Exercise"** để thêm bài tập
4. Nhập các thông tin:
   - **Exercise Name**: Tên bài tập (ví dụ: "Bench Press")
   - **Sets**: Số set (ví dụ: 4)
   - **Reps**: Số reps (ví dụ: 8-10 hoặc 10)
   - **Description** (tùy chọn): Mô tả bài tập
   - **Rest Time** (tùy chọn): Thời gian nghỉ (giây)
   - **RPE** (tùy chọn): Mức độ khó (1-10)
   - **Tempo** (tùy chọn): Tốc độ (ví dụ: 3-1-2-0)
5. Nhấn **"Save Workout"** để lưu

### Bước 3: Ghi Nhận Tracking Buổi Tập
1. Ở trang Home, nhấn vào workout để xem chi tiết
2. Nhấn vào exercise (bài tập) cần ghi nhận
3. Nhấn **"▶ Start Tracking"** để bắt đầu
4. Nhập weight (kg) và reps cho từng set
5. **(Tùy chọn)** Viết ghi chú buổi tập ở phần **"📝 Session Note"**
   - Ví dụ: "Cảm thấy mệt", "Nên giảm weight", etc.
6. Nhấn **"✓ Save Set 1"**, **"✓ Save Set 2"**, ... để lưu từng set
   - Hoặc chỉ nhập tất cả set rồi lưu từng cái

### Bước 4: Chỉnh Sửa Buổi Tập Trước
1. Trên trang exercise detail, tìm phần **"✅ Last Session"**
2. Nhấn **"✎ Edit Last Session"**
3. Chỉnh sửa weight, reps, hoặc ghi chú
4. **Có thể để trống** những set không muốn chỉnh sửa
5. Nhấn **"✓ Save All"** để lưu tất cả thay đổi
6. Nhấn **"Cancel"** để hủy bỏ

### Bước 5: Đánh Dấu Heavy Day
1. Khi đang tracking, phần dưới cùng có nút **"💪 Mark as Heavy Day"**
2. Nhấn để đánh dấu buổi tập này là ngày tập nặng
3. Nút sẽ đổi thành **"💪 Heavy Day!"** nếu đã được đánh dấu

### Bước 6: Xem Lịch Sử & So Sánh
- **Last Session**: Xem buổi tập lần trước (xanh lá cây)
- **Heavy Day**: Xem buổi tập nặng nhất (đỏ)
- Các thông tin hiển thị: weight, reps, ngày tập, ghi chú

### Bước 7: Chuyển Đổi Chế Độ Sáng/Tối
1. Ở trang Home, nhấn biểu tượng **☀️** (sáng) hoặc **🌙** (tối) ở góc trên phải
2. Giao diện sẽ chuyển đổi ngay lập tức

---

## 🚀 Hướng Dẫn Chạy App Cục Bộ (Local)

### Yêu Cầu
- **Node.js** phiên bản 16+ hoặc cao hơn
- **npm** hoặc **yarn**
- Terminal/Command line

### Bước 1: Clone Repository
```bash
git clone https://github.com/CNDvn/tracking-fitness.git
cd tracking-fitness
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Tạo Thư Mục Data (Nếu Chưa Có)
```bash
mkdir -p data
```

### Bước 4: Chạy Development Server
```bash
npm run dev
```

### Bước 5: Truy Cập Ứng Dụng
- Mở trình duyệt (browser)
- Truy cập: **http://localhost:3000**
- Ứng dụng sẽ tự động reload khi bạn chỉnh sửa code

### Lệnh Hữu Ích Khác
```bash
# Build cho production
npm run build

# Chạy production server
npm start

# Lint code
npm run lint
```

---

## 🐳 Hướng Dẫn Deploy Với Docker

### Yêu Cầu
- **Docker** cài đặt trên hệ thống
- **Docker Compose** (thường đi kèm Docker Desktop)

### Phương Pháp 1: Docker Compose (Khuyến Nghị)

#### Bước 1: Build & Run
```bash
docker-compose up --build
```

#### Bước 2: Truy Cập
- Mở trình duyệt: **http://localhost:3000**

#### Bước 3: Dừng Container
```bash
docker-compose down
```

#### Bước 4: Chạy Background (Không Hiển Thị Logs)
```bash
docker-compose up -d --build
```

#### Xem Logs
```bash
docker-compose logs -f
```

### Phương Pháp 2: Docker Manual (Không Dùng Compose)

#### Bước 1: Build Image
```bash
docker build -t fitness-tracker:latest .
```

#### Bước 2: Chạy Container
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name fitness-app \
  fitness-tracker:latest
```

#### Bước 3: Xem Logs
```bash
docker logs -f fitness-app
```

#### Bước 4: Dừng Container
```bash
docker stop fitness-app
docker rm fitness-app
```

### Lưu Ý Quan Trọng
- **Data Persistence**: Thư mục `/data` được mount vào container, dữ liệu sẽ được lưu trữ
- **Port**: Ứng dụng chạy trên port **3000**
- **Environment**: Nếu cần, có thể thêm biến environment trong `docker-compose.yml`

---

## 📦 Cấu Trúc Project

```
tracking-fitness/
├── pages/
│   ├── index.js              # Trang chính (Home)
│   ├── login.js              # Trang đăng nhập
│   ├── setup.js              # Tạo workout mới
│   ├── _app.js               # App component, User context
│   ├── _document.js          # Document meta
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.js      # API đăng nhập
│   │   │   └── register.js   # API đăng ký
│   │   ├── workouts.js       # CRUD workout
│   │   ├── workouts/[id].js  # Workout detail
│   │   ├── trackings.js      # Create tracking
│   │   ├── trackings/
│   │   │   ├── update.js     # Update single set
│   │   │   ├── update-all.js # Update all sets
│   │   │   └── heavy.js      # Mark heavy day
│   └── workout/
│       └── [id]/
│           └── exercise/
│               └── [exerciseIndex].js # Exercise detail & tracking
├── lib/
│   ├── auth.js               # Authentication utilities
│   └── constants.js          # Constants
├── styles/
│   └── globals.css           # Global styles & CSS variables
├── data/
│   ├── users.json            # User data
│   ├── workouts.json         # Workout data
│   └── trackings.json        # Tracking data
├── public/                   # Static files
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies & scripts
└── README.md                 # Documentation (file này)
```

---

## 🔐 Bảo Mật & Authentication

### Cách Hoạt Động
1. **Đăng ký**: Password được hash bằng **bcryptjs**
2. **Đăng nhập**: So sánh hash, cấp **JWT token**
3. **Token Storage**: Lưu trong **localStorage** (client-side)
4. **API Requests**: Gửi token trong header: `Authorization: Bearer <token>`
5. **Validation**: Server xác minh token trước khi trả dữ liệu

### Notes
- ⚠️ Không bao giờ commit token hoặc sensitive data
- ⚠️ Sử dụng HTTPS khi deploy lên production
- ⚠️ Rotate token định kỳ nếu cần security cao

---

## 📱 Thiết Kế & UX

### Mobile-First
- Tối ưu cho màn hình 390px (iPhone 13 Pro)
- Responsive trên tất cả kích thước từ 360px - 1920px

### Color Scheme

**Light Mode (Mặc Định)**
- Background: White (`#ffffff`)
- Text: Dark gray (`#1f2937`)
- Accent: Purple (`#7c3aed`)
- Borders: Light gray (`#e5e7eb`)

**Dark Mode**
- Background: Deep slate (`#0f172a`)
- Text: Light (`#f1f5f9`)
- Accent: Purple (`#7c3aed`)
- Borders: Slate (`#334155`)

### Typography
- Headlines: 28px, weight 600
- Subheadings: 20px, weight 600
- Body: 14px, weight 400
- Meta: 13px, weight 500, muted

### Components
- Buttons: Solid color, hover effect (opacity + lift)
- Cards: Border + subtle shadow
- Inputs: Border focus, smooth transitions
- Messages: Left accent border, semantic colors

---

## 🔧 Troubleshooting

### Vấn Đề: App không load
**Giải pháp:**
- Kiểm tra Node.js version: `node --version` (cần 16+)
- Xóa `node_modules` và cài lại: `rm -rf node_modules && npm install`
- Clear browser cache (Ctrl+Shift+Del)

### Vấn Đề: Dữ liệu không lưu
**Giải pháp:**
- Kiểm tra thư mục `data/` tồn tại
- Kiểm tra quyền write trên thư mục `data/`
- Xem console (F12) có lỗi gì không

### Vấn Đề: Docker không chạy
**Giải pháp:**
- Kiểm tra Docker daemon chạy: `docker --version`
- Kiểm tra port 3000 không bị chiếm: `lsof -i :3000`
- Build lại image: `docker-compose build --no-cache`

### Vấn Đề: Login không hoạt động
**Giải pháp:**
- Kiểm tra dữ liệu user trong `data/users.json`
- Xóa localStorage: `localStorage.clear()` trong console
- Tạo account mới

---

## 📊 Tech Stack

| Thành Phần | Công Nghệ |
|-----------|----------|
| **Frontend Framework** | Next.js 14 |
| **UI Library** | React 18 |
| **Styling** | CSS (CSS Variables) |
| **Backend** | Node.js (API Routes) |
| **Database** | JSON Files |
| **Auth** | JWT + bcryptjs |
| **Deployment** | Docker, Docker Compose |
| **Package Manager** | npm |

---

## 📝 API Documentation

### Authentication
- **POST** `/api/auth/register` - Đăng ký
- **POST** `/api/auth/login` - Đăng nhập

### Workouts
- **GET** `/api/workouts` - Lấy tất cả workout
- **GET** `/api/workouts/:id` - Lấy workout chi tiết
- **POST** `/api/workouts` - Tạo workout mới
- **PUT** `/api/workouts/:id` - Chỉnh sửa workout
- **DELETE** `/api/workouts/:id` - Xóa workout

### Trackings
- **GET** `/api/trackings` - Lấy tracking (filter bằng `?workoutId=`)
- **POST** `/api/trackings` - Tạo tracking mới
- **POST** `/api/trackings/update` - Update set
- **POST** `/api/trackings/update-all` - Update tất cả set
- **DELETE** `/api/trackings/:id` - Xóa tracking

**Header yêu cầu:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🎓 Hướng Dẫn Sử Dụng Thuật Ngữ Fitness

### RPE (Rate of Perceived Exertion)
- **1-3**: Rất dễ, dễ dàng
- **4-5**: Nhẹ
- **6-7**: Trung bình
- **8-9**: Khó, gần hết sức
- **10**: Tối đa, không thể làm thêm set

**Ví dụ**: RPE 8 = bạn có thể làm thêm 2 reps nữa

### Tempo (Tốc Độ Chuyển Động)
**Format**: `Eccentric-Pause-Concentric-Pause`

**Ví dụ**: `3-1-2-0`
- **3s**: Hạ weight (eccentric) - 3 giây
- **1s**: Dừng lại ở dưới - 1 giây
- **2s**: Nâng weight (concentric) - 2 giây
- **0s**: Không dừng ở trên - 0 giây

### Sets × Reps
- **Set 1: 8-10 reps** = 1 set với 8-10 lần lặp
- **4 sets**: Làm lại 4 lần

---

## 🤝 Đóng Góp

Nếu muốn đóng góp:
1. Fork repository
2. Tạo branch feature: `git checkout -b feature/your-feature`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Tạo Pull Request

---

## 📄 License

MIT License - Tự do sử dụng và sửa đổi

---

## 📧 Liên Hệ & Hỗ Trợ

- **Issues**: Báo cáo lỗi trên GitHub Issues
- **Discussions**: Thảo luận trên GitHub Discussions
- **Email**: Liên hệ qua email (nếu có)

---

## 🎉 Cảm Ơn

Cảm ơn bạn đã sử dụng **Tracking Fitness App**. Chúc bạn tập luyện hiệu quả và đạt được mục tiêu fitness của bạn! 💪

---

**Version**: 1.0.0  
**Last Updated**: January 11, 2026  
**Maintained by**: CNDvn
