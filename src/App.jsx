import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import FirstPage from './pages/FirstPage';
import Homepage from './pages/Homepage';
import Library from './pages/Library';
import GuidePage from './pages/Guide';
import CodeEnter from './pages/CodeEnter';
import AccountPage from './pages/AccountPage';
import LeaderBoard from './pages/LeaderBoard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequireCrosswordSession from './components/hoc/RequireCrosswordSession';
import { withProfileCheck } from './components/hoc/withProfileCheck';

// Lazy load cho các trang phức tạp
const CreatePage = withProfileCheck(lazy(() => import('./pages/CreatePage')));
const SinglePlay = withProfileCheck(lazy(() => import('./pages/SinglePlay')));
const TeamPlay = withProfileCheck(lazy(() => import('./pages/TeamPlay')));
const CodePlay = lazy(() => import('./pages/CodePlay'));

// Loading component đơn giản
const LoadingFallback = () => <div className="w-full h-screen flex items-center justify-center">Loading...</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public route - Trang đăng nhập */}
          <Route path="/" element={
            <PublicRoute>
              <FirstPage />
            </PublicRoute>
          } />
          
          {/* Protected routes với lazy loading */}
          <Route path="play" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <SinglePlay />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="team-play" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TeamPlay />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="create" element={
            <ProtectedRoute>
              <RequireCrosswordSession>
                <Suspense fallback={<LoadingFallback />}>
                  <CreatePage />
                </Suspense>
              </RequireCrosswordSession>
            </ProtectedRoute>
          } />
          
          {/* CodeEnter tách riêng */}
          <Route path="code" element={
            <ProtectedRoute>
              <CodeEnter />
            </ProtectedRoute>
          } />
          
          {/* Code Play */}
          <Route path="code-play/:code" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <CodePlay />
              </Suspense>
            </ProtectedRoute>
          } />
          
          {/* Các trang cơ bản sử dụng Layout - không lazy load */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="homepage" element={<Homepage />} />
            <Route path="library" element={<Library />} />
            <Route path="leaderboard" element={<LeaderBoard />} />
            <Route path="guide" element={<GuidePage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
