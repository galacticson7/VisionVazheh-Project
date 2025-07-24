// src/pages/LeaderboardPage.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import styles from './LeaderboardPage.module.css';
import { FaTrophy, FaStar } from 'react-icons/fa';

export default function LeaderboardPage() {
  usePageTitle('جدول امتیازات');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/progress/leaderboard/')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className={styles.loadingText}>در حال بارگذاری کهکشان برترین‌ها...</p>;
  }

  return (
    <div className={styles.leaderboardContainer}>
      <h1 className={styles.title}><FaTrophy /> کهکشان برترین‌ها</h1>
      <ul className={styles.userList}>
        {users.map((rankedUser, index) => (
          <li 
            key={rankedUser.id} 
            className={`${styles.userRow} ${user && user.id === rankedUser.id ? styles.currentUser : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className={styles.rank} data-rank={index + 1}>{index + 1}</span>
            <div className={styles.userInfo}>
              {/* --- تغییر اصلی اینجاست --- */}
              <p className={styles.userName}>{rankedUser.username}</p>
            </div>
            <div className={styles.userScore}>
              <span>{rankedUser.stardust_points}</span>
              <FaStar />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}