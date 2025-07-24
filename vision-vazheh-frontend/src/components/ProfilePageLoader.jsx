// src/components/ProfilePageLoader.jsx
import Skeleton from './Skeleton';
import styles from '../pages/ProfilePage.module.css'; // از استایل‌های صفحه پروفایل برای چیدمان استفاده می‌کنیم

const ProfilePageLoader = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Skeleton width="180px" height="2rem" />
        <Skeleton width="80px" height="38px" />
      </div>
      
      <div className={styles.statsGrid}>
        {/* سه کارت آمار */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={styles.statCard} key={index}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <div className={styles.statText}>
              <Skeleton width="100px" height="1.5rem" />
              <Skeleton width="70px" height="0.9rem" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.achievementsSection}>
        <h3><Skeleton width="150px" height="1.5rem" /></h3>
        <div className={styles.achievementsGrid}>
          {/* چهار کارت دستاورد */}
          {Array.from({ length: 4 }).map((_, index) => (
             <div className={styles.statCard} key={index} style={{ alignItems: 'center', gap: '1rem' }}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
                <div style={{ flexGrow: 1 }}>
                    <Skeleton width="120px" height="1rem" />
                    <Skeleton width="150px" height="0.8rem" />
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLoader;