// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AchievementCard from '../components/AchievementCard';
import { FaStar, FaFire, FaPhone } from 'react-icons/fa';
import styles from './ProfilePage.module.css';
import usePageTitle from '../hooks/usePageTitle'; // --- اضافه شد

function StatCard({ icon, label, value }) {
  // ... کد این کامپوننت بدون تغییر ...
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statText}>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  usePageTitle('پروفایل'); // --- اضافه شد
  // ... بقیه کد بدون تغییر ...
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await axiosInstance.get('/users/me/');
        setUser(userRes.data);
        const achRes = await axiosInstance.get('/progress/my-achievements/');
        setAchievements(achRes.data);
      } catch (e) {
        console.error("خطا در دریافت اطلاعات پروفایل:", e);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <p className={styles.loadingText}>در حال بارگذاری اطلاعات...</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>پروفایل شما</h2>
        <button onClick={handleLogout} className="btn btn-danger">خروج</button>
      </div>
      
      <div className={styles.statsGrid}>
        <StatCard
          icon={<FaPhone />}
          label="شماره موبایل"
          value={user.phone_number}
        />
        <StatCard
          icon={<FaStar />}
          label="امتیاز (Stardust)"
          value={user.stardust_points}
        />
        <StatCard
          icon={<FaFire />}
          label="استریک روزانه"
          value={user.streak}
        />
      </div>

      <div className={styles.achievementsSection}>
        <h3>مدال‌های شما</h3>
        {achievements.length > 0 ? (
          <div className={styles.achievementsGrid}>
            {achievements.map(a => (
              <AchievementCard
                key={a.id}
                achievement={a.achievement}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noAchievements}>هنوز مدالی کسب نکرده‌اید. به تلاش ادامه دهید!</p>
        )}
      </div>
    </div>
  );
}