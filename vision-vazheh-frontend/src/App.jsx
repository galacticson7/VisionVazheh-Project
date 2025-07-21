// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthForm from './pages/AuthForm';
import LessonDetailPage from './pages/LessonDetailPage';
import ProfilePage from './pages/ProfilePage';
import PracticePage from './pages/PracticePage';
import HelpPage from './pages/HelpPage';

function App() {
  return (
      <Routes>
        {/* مسیرهای عمومی که تمام صفحه هستند و Layout ندارند */}
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />

        {/* مسیرهای داخلی که از Layout اصلی استفاده می‌کنند */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }/>
        <Route path="/help" element={<Layout><HelpPage /></Layout>} />
        <Route path="/lessons/:lessonId" element={<ProtectedRoute><Layout isNarrow={true}><LessonDetailPage /></Layout></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Layout><PracticePage /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

        {/* اگر مسیری پیدا نشد، به صفحه اصلی برگرد */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;