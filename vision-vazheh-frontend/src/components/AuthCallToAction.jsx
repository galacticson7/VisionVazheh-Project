// src/components/AuthCallToAction.jsx
import { Link } from 'react-router-dom';
import styles from './AuthCallToAction.module.css';

function AuthCallToAction({ icon, title, message }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={styles.buttons}>
        <Link to="/login" className="btn btn-neon">ورود</Link>
        {/* کلاس این دکمه به btn-neon تغییر کرد */}
        <Link to="/register" className="btn btn-neon">ثبت نام</Link>
      </div>
    </div>
  );
}

export default AuthCallToAction;