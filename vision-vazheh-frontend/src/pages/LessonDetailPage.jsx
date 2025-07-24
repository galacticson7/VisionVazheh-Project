// src/pages/LessonDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Link اضافه شد
import axiosInstance from '../api/axiosInstance';
import Flashcard from '../components/Flashcard';
import { FiCheck, FiX, FiAward } from 'react-icons/fi'; // FiAward اضافه شد
import styles from './LessonDetailPage.module.css';
import usePageTitle from '../hooks/usePageTitle';
import LessonDetailPageLoader from '../components/LessonDetailPageLoader';

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  usePageTitle(`یادگیری درس ${lessonId}`);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isLessonFinished, setIsLessonFinished] = useState(false); // --- ۱. وضعیت جدید برای اتمام درس
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        axiosInstance.get(`/lessons/${lessonId}/words/`)
        .then((response) => { 
            setWords(response.data); 
            setLoading(false); 
        })
        .catch((error) => { 
            console.error('Error fetching words:', error); 
            setLoading(false); 
        });
    }, 800);
  }, [lessonId]);

  const showNextWord = () => {
    if (currentIndex === words.length - 1) {
      // اگر آخرین کلمه بود، وضعیت اتمام درس را فعال می‌کنیم
      setIsLessonFinished(true);
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

  if (loading) return <LessonDetailPageLoader />;
  if (!words.length) return <p className={styles.loadingText}>لغتی برای این درس یافت نشد.</p>;

  return (
    <div className={styles.container}>
      {/* --- ۲. نمایش پیام اتمام و دکمه آزمون --- */}
      {isLessonFinished ? (
        <div className={styles.completionContainer}>
          <h3>🚀 مرحله اول تمام شد!</h3>
          <p>شما تمام لغات این درس را مرور کردید. حالا برای سنجش نهایی، در آزمون شرکت کنید.</p>
          <Link to={`/lessons/${lessonId}/test`} className={styles.testButton}>
            <FiAward /> شروع آزمون نهایی
          </Link>
        </div>
      ) : (
        <>
          <Flashcard word={words[currentIndex]} />
          <div className={styles.actionControls}>
            <button onClick={() => handleWordAction('known')} className={`${styles.actionBtn} ${styles.knowBtn}`}>
              <FiCheck /> بلد بودم
            </button>
            <button onClick={() => handleWordAction('unknown')} className={`${styles.actionBtn} ${styles.forgetBtn}`}>
              <FiX /> بلد نبودم
            </button>
          </div>
        </>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}