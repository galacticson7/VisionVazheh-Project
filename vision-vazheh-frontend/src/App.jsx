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
import LeaderboardPage from './pages/LeaderboardPage';
import TestPage from './pages/TestPage'; // --- ۱. ایمپورت صفحه جدید

function App() {
  return (
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />

        <Route path="/" element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>}/>
        <Route path="/help" element={<Layout><HelpPage /></Layout>} />
        <Route path="/lessons/:lessonId" element={<ProtectedRoute><Layout isNarrow={true}><LessonDetailPage /></Layout></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Layout><PracticePage /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><LeaderboardPage /></Layout></ProtectedRoute>} />
        
        {/* --- ۲. اضافه کردن مسیر جدید برای صفحه آزمون --- */}
        <Route path="/lessons/:lessonId/test" element={<ProtectedRoute><Layout isNarrow={true}><TestPage /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;