// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';
// آیکون‌ها را از کتابخانه جدید وارد می‌کنیم
import { FiHome, FiTarget, FiUser } from 'react-icons/fi';

function BottomNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.iconWrapper}>
        <FiHome className={styles.icon} />
        <span className={styles.label}>خانه</span>
      </NavLink>
      <NavLink to="/practice" className={({ isActive }) => isActive ? styles.active : styles.iconWrapper}>
        <FiTarget className={styles.icon} />
        <span className={styles.label}>تمرین</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.iconWrapper}>
        <FiUser className={styles.icon} />
        <span className={styles.label}>پروفایل</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;