// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import LessonCard from '../components/LessonCard';
import styles from './HomePage.module.css';
import { useAuth } from '../context/AuthContext'; // <-- مسیر به حالت صحیح برگشت
import usePageTitle from '../hooks/usePageTitle';
import HomePageLoader from '../components/HomePageLoader';

export default function HomePage() {
  usePageTitle('خانه');
  const { isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setTimeout(() => {
        Promise.all([
          axiosInstance.get('/lessons/'),
          axiosInstance.get('/progress/lessons-status/')
        ]).then(([lessonsRes, completedRes]) => {
          setLessons(lessonsRes.data);
          setCompletedIds(completedRes.data.completed_lessons);
          setLoading(false);
        }).catch(error => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
      }, 800);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading && isAuthenticated) {
    return <HomePageLoader />
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>درس‌ها</h1>
      <div className={styles.lessonsGrid}>
        {lessons.map(lesson => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson} 
            isCompleted={completedIds.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}