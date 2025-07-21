// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';
import { FiLogIn, FiHelpCircle } from 'react-icons/fi';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          🚀 ویژن واژه
        </Link>
        <div className={styles.navLinks}>
          {/* لینک جدید راهنما */}
          <Link to="/help" className={styles.helpLink}>
            <FiHelpCircle />
          </Link>

          {isAuthenticated ? (
            <span className={styles.welcome}>خوش آمدید!</span>
          ) : (
            <Link to="/login" className="btn btn-neon">
              <FiLogIn style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              <span style={{ verticalAlign: 'middle' }}>ورود / ثبت نام</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;