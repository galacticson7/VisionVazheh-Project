// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AchievementCard from '../components/AchievementCard';
import { FaStar, FaFire, FaPhone, FaTrophy, FaChartBar } from 'react-icons/fa';
import styles from './ProfilePage.module.css';
import usePageTitle from '../hooks/usePageTitle';
import ProfilePageLoader from '../components/ProfilePageLoader'; 

function StatCard({ icon, label, value }) {
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
  usePageTitle('پروفایل');
  
  const { user, logout } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [rankInfo, setRankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        axiosInstance.get('/progress/my-achievements/'),
        axiosInstance.get('/progress/my-rank/')
      ]).then(([achRes, rankRes]) => {
        setAchievements(achRes.data);
        setRankInfo(rankRes.data);
        setLoading(false);
      }).catch(error => {
        console.error("خطا در دریافت اطلاعات پروفایل:", error);
        setLoading(false);
      });
    } else { setLoading(false); }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || !user) return <ProfilePageLoader />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        {/* --- تغییر اصلی اینجاست --- */}
        <h2>{user.username}</h2>
        <button onClick={handleLogout} className="btn btn-danger">خروج</button>
      </div>
      
      <div className={styles.statsGrid}>
        <StatCard icon={<FaPhone />} label="شماره موبایل" value={user.phone_number} />
        <StatCard icon={<FaStar />} label="امتیاز (Stardust)" value={user.stardust_points} />
        <StatCard icon={<FaFire />} label="استریک روزانه" value={user.streak} />
      </div>

      {rankInfo && (
        <div className={styles.rankCard}>
          <FaTrophy className={styles.rankIcon} />
          <div className={styles.rankText}>
            <p className={styles.rankLabel}>شما در رتبه</p>
            <p className={styles.rankValue}>{rankInfo.rank}</p>
            <p className={styles.rankLabel}>کهکشان قرار دارید!</p>
          </div>
        </div>
      )}

      <Link to="/leaderboard" className={styles.leaderboardLink}>
        <FaChartBar /> مشاهده جدول کامل امتیازات
      </Link>

      <div className={styles.achievementsSection}>
        <h3>مدال‌های شما</h3>
        {achievements.length > 0 ? (
          <div className={styles.achievementsGrid}>
            {achievements.map(a => (<AchievementCard key={a.id} achievement={a.achievement} />))}
          </div>
        ) : (
          <p className={styles.noAchievements}>هنوز مدالی کسب نکرده‌اید. به تلاش ادامه دهید!</p>
        )}
      </div>
    </div>
  );
}