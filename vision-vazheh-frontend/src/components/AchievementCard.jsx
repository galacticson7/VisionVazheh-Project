// src/components/AchievementCard.jsx
import styles from './AchievementCard.module.css';
import { FaMedal } from 'react-icons/fa';

function AchievementCard({ achievement }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <FaMedal />
      </div>
      <div className={styles.textWrapper}>
        <h4 className={styles.name}>{achievement.name}</h4>
        <p className={styles.description}>{achievement.description}</p>
      </div>
    </div>
  );
}
export default AchievementCard;