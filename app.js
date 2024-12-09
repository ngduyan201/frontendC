import express from 'express';
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';

const app = express();

// Middleware
app.use(cors());  // Cho phép CORS
app.use(express.json());  // Cho phép parse JSON body
app.use(express.urlencoded({ extended: true }));  // Cho phép parse URL-encoded bodies

// Thêm route test
app.get('/', (req, res) => {
    res.send('API đang chạy...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Có lỗi xảy ra!');
});

// Định nghĩa PORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function App() {
  return (
    <div>
      {/* Các component khác */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;