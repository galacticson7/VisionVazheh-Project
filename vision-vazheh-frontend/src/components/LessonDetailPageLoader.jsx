// src/components/LessonDetailPageLoader.jsx
import Skeleton from './Skeleton';
import styles from '../pages/LessonDetailPage.module.css'; // از استایل‌های صفحه برای چیدمان استفاده می‌کنیم

const LessonDetailPageLoader = () => {
  return (
    <div className={styles.container}>
      {/* Skeleton for Flashcard */}
      <div style={{ width: '100%', maxWidth: '420px', height: '280px' }}>
        <Skeleton width="100%" height="100%" borderRadius="16px" />
      </div>

      {/* Skeletons for Action Buttons */}
      <div className={styles.actionControls}>
        <Skeleton width="150px" height="48px" borderRadius="50px" />
        <Skeleton width="150px" height="48px" borderRadius="50px" />
      </div>
    </div>
  );
};

export default LessonDetailPageLoader;