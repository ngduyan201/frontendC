import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import FirstPage from './pages/FirstPage';
import Homepage from './pages/Homepage';
import SinglePlay from './pages/SinglePlay';
import CreatePage from './pages/CreatePage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load các trang không cần thiết ngay lập tức
const Library = lazy(() => import('./pages/Library'));
const GuidePage = lazy(() => import('./pages/Guide'));
const CodeEnter = lazy(() => import('./pages/CodeEnter'));
const CodePlay = lazy(() => import('./pages/CodePlay'));
const TeamPlay = lazy(() => import('./pages/TeamPlay'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Loading component đơn giản
const LoadingFallback = () => <div className="w-full h-screen flex items-center justify-center">Loading...</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public route - Trang đăng nhập */}
            <Route path="/" element={
              <PublicRoute>
                <FirstPage />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="play" element={
              <ProtectedRoute>
                <SinglePlay />
              </ProtectedRoute>
            } />
            <Route path="team-play" element={
              <ProtectedRoute>
                <TeamPlay />
              </ProtectedRoute>
            } />
            <Route path="code-play" element={
              <ProtectedRoute>
                <CodePlay />
              </ProtectedRoute>
            } />
            <Route path="create" element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            } />
            
            {/* Các trang sử dụng Layout - đều là protected */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="homepage" element={<Homepage />} />
              <Route path="library" element={<Library />} />
              <Route path="guide" element={<GuidePage />} />
              <Route path="code" element={<CodeEnter />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
