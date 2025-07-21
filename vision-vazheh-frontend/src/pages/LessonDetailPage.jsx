// src/pages/LessonDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Flashcard from '../components/Flashcard';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './LessonDetailPage.module.css';
import usePageTitle from '../hooks/usePageTitle'; // --- ۱. ایمپورت هوک جدید

export default function LessonDetailPage() {
  usePageTitle('یادگیری درس'); // --- ۲. استفاده از هوک برای تغییر عنوان

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const { lessonId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/lessons/${lessonId}/words/`)
      .then((response) => { 
        setWords(response.data); 
        setLoading(false); 
      })
      .catch((error) => { 
        console.error('Error fetching words:', error); 
        setLoading(false); 
      });
  }, [lessonId]);

  const showNextWord = () => {
    if (currentIndex === words.length - 1) {
      setMessage('درس تمام شد! به صفحه اصلی برمی‌گردید...');
      setTimeout(() => navigate('/'), 2000);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleWordAction = (action) => {
    const currentWordId = words[currentIndex].id;
    const feedbackMessage = action === 'known' ? 'به عنوان "بلد بودم" ثبت شد!' : 'به لیست مرور اضافه شد!';
    
    axiosInstance.post(`/progress/my-words/update-status/${currentWordId}/`, { action })
      .then(response => {
        setMessage(feedbackMessage);
        // --- ۳. کاهش زمان تأخیر برای حس سرعت بیشتر ---
        setTimeout(() => { 
          setMessage(''); 
          showNextWord(); 
        }, 300);
      })
      .catch((error) => {
        console.error("Error updating word status:", error);
        setMessage('خطایی رخ داد.');
        setTimeout(() => { 
          setMessage(''); 
          showNextWord(); 
        }, 300);
      });
  };

  if (loading) return <p className={styles.loadingText}>در حال بارگذاری لغات...</p>;
  if (!words.length) return <p className={styles.loadingText}>لغتی برای این درس یافت نشد.</p>;

  return (
    <div className={styles.container}>
      <Flashcard word={words[currentIndex]} />

      <div className={styles.actionControls}>
        <button onClick={() => handleWordAction('known')} className={`${styles.actionBtn} ${styles.knowBtn}`}>
          <FiCheck />
          بلد بودم
        </button>
        <button onClick={() => handleWordAction('unknown')} className={`${styles.actionBtn} ${styles.forgetBtn}`}>
          <FiX />
          بلد نبودم
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}