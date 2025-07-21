// src/components/LessonCard.jsx
import { Link } from 'react-router-dom';
import { FaBook, FaBrain, FaLeaf, FaArrowLeft } from 'react-icons/fa';
import styles from './LessonCard.module.css';

const iconMap = { book: FaBook, brain: FaBrain, leaf: FaLeaf };

function LessonCard({ lesson, isCompleted }) {
  const IconComponent = iconMap[lesson.icon_name] || FaBook;
  return (
    <Link 
      to={`/lessons/${lesson.id}`} 
      // کلاس completed همچنان برای اعمال استایل جدید باقی می‌ماند
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
    >
      {/* آیکون تیک از اینجا حذف شد */}
      <IconComponent className={styles.icon} />
      <div className={styles.textContainer}>
        <h3 className={styles.title}>{lesson.title}</h3>
        <p className={styles.grade}>پایه {lesson.grade}</p>
      </div>
      <FaArrowLeft className={styles.arrow} />
    </Link>
  );
}
export default LessonCard;