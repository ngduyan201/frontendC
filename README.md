# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
"# frontendC" 

# Crossword Game Web Application

Trò chơi ô chữ trực tuyến được xây dựng với React và Node.js, cho phép người chơi giải các câu đố ô chữ theo nhiều chế độ khác nhau.

## ✨ Tính năng chính

- 🎮 Đa dạng chế độ chơi:
  - Chơi đơn (Single Play)
  - Chơi đội (Team Play) 
  - Chơi theo mã code (Code Play)
- 🛠️ Tạo và quản lý ô chữ riêng
- 👥 Hệ thống tài khoản người dùng
- 📊 Bảng xếp hạng và theo dõi tiến độ
- 🎵 Âm thanh và hiệu ứng tương tác
- 🔒 Mã hóa đáp án với CryptoJS

## 🛠️ Công nghệ sử dụng

### Frontend
- React + Vite
- Styled Components
- React Router DOM
- React Toastify
- Use Sound
- CryptoJS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Bcrypt

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- npm (phiên bản 8.0.0 trở lên)
- MongoDB (phiên bản 6.0.0 trở lên)

### Các bước cài đặt

1. **Mở terminal/command prompt trong thư mục dự án**

2. **Cài đặt dependencies cho backend**

bash
cd backend
npm install

3. **Sửa file .env trong thư mục backend**

- Chỉnh sửa các biến môi trường cho hợp lí, file env đã có ghi chú

4. **Cài đặt dependencies cho frontend**

bash
cd ../CrosswordWebGame
npm install

5. **Chạy ứng dụng**

Mở 2 terminal riêng biệt:

Terminal 1 - Chạy Backend:

bash
cd backend
npm start 

Terminal 2 - Chạy Frontend:

bash
cd CrosswordWebGame
npm run dev

6. **Truy cập ứng dụng**

- Mở trình duyệt web
- Truy cập: `http://localhost:5173`

### 🔧 Mở Dev Tools để debug

- Vào file CrosswordWebGame/main.jsx
- Tìm dòng import './utils/protection'
- Bỏ dấu `//` ở dòng đó để bật Dev Tools bằng F12, Ctrl + Shift + I hoặc Ctrl + U


## 👨‍💻 Tác giả

- Nguyễn Duy An - [Email](mailto:ngduyan201@gmail.com)

## 🎵 Credits

- Music: [Roa - Walk Around【LoFi ver.】](https://hypeddit.com/roamusic/walkaroundlofi)
- Sound Effect: [freesound_community from Pixabay](https://pixabay.com/vi/users/freesound_community-46691455/)
