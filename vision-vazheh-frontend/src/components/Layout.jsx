// src/components/Layout.jsx
import styles from './Layout.module.css';
import Header from './Header';
import BottomNav from './BottomNav';

function Layout({ children, isNarrow = false }) {
  return (
    <div className={`${styles.layoutContainer} ${isNarrow ? styles.narrow : ''}`}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;