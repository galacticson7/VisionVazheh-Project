// src/components/HomePageLoader.jsx
import LessonCardSkeleton from './LessonCardSkeleton';
import styles from '../pages/HomePage.module.css'; // از استایل صفحه اصلی برای چیدمان گرید استفاده می‌کنیم

const HomePageLoader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.lessonsGrid}>
        {/* یک آرایه با ۶ عضو می‌سازیم تا ۶ اسکلتون نمایش دهیم */}
        {Array.from({ length: 6 }).map((_, index) => (
          <LessonCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default HomePageLoader;