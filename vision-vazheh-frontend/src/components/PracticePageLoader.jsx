// src/components/PracticePageLoader.jsx
import Skeleton from './Skeleton';
import styles from '../pages/PracticePage.module.css'; // از استایل‌های صفحه تمرین برای چیدمان استفاده می‌کنیم

const PracticePageLoader = () => {
  return (
    <div className={styles.practiceContainer}>
      <h2 className={styles.title}>
        <Skeleton width="200px" height="1.8rem" />
      </h2>
      <div className={styles.practiceSession}>
        <div className={styles.progressBar}>
          <Skeleton height="8px" borderRadius="4px" />
        </div>
        
        {/* Skeleton for Flashcard */}
        <div style={{ width: '100%', maxWidth: '420px', height: '280px' }}>
            <Skeleton width="100%" height="100%" borderRadius="16px" />
        </div>
        
        <div className={styles.actionButtons}>
          <Skeleton width="70px" height="70px" borderRadius="50%" />
          <Skeleton width="70px" height="70px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
};

export default PracticePageLoader;