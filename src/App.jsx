import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import FirstPage from './pages/FirstPage';
import Homepage from './pages/Homepage';
import SinglePlay from './pages/SinglePlay';
import CreatePage from './pages/CreatePage';
import { AuthProvider } from './contexts/AuthContext';

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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* FirstPage không sử dụng Layout */}
            <Route path="/" element={<FirstPage />} />
            
            {/* Các trang không sử dụng Layout chung */}
            <Route path="play" element={<SinglePlay />} />
            <Route path="team-play" element={<TeamPlay />} />
            <Route path="code-play" element={<CodePlay />} />
            <Route path="create" element={<CreatePage />} />
            
            {/* Các trang sử dụng Layout */}
            <Route element={<Layout />}>
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
