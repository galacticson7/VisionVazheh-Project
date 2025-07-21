// src/components/LessonCardSkeleton.jsx
import Skeleton from './Skeleton';
import styles from './LessonCard.module.css'; // از استایل کارت اصلی برای چیدمان استفاده می‌کنیم

const LessonCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div className={styles.textContainer}>
        <Skeleton width="70%" height="1.2rem" />
        <Skeleton width="40%" height="0.9rem" />
      </div>
      <Skeleton width="24px" height="24px" borderRadius="50%" />
    </div>
  );
};

export default LessonCardSkeleton;