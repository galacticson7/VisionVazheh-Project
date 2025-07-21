// src/pages/PracticePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import AuthCallToAction from '../components/AuthCallToAction';
import Flashcard from '../components/Flashcard';
import { FaCheckCircle, FaTimesCircle, FaRocket } from 'react-icons/fa';
import styles from './PracticePage.module.css';
import usePageTitle from '../hooks/usePageTitle'; // --- اضافه شد

function UpcomingReviews({ summary }) {
  // ... کد این کامپوننت بدون تغییر ...
  if (!summary || (summary.tomorrow === 0 && summary.in_three_days === 0 && summary.in_a_week === 0)) {
    return null;
  }
  return (
    <div className={styles.upcomingReviews}>
      <h4>مرورهای آینده:</h4>
      {summary.tomorrow > 0 && <p>فردا: <strong>{summary.tomorrow}</strong> لغت</p>}
      {summary.in_three_days > 0 && <p>در سه روز آینده: <strong>{summary.in_three_days}</strong> لغت</p>}
      {summary.in_a_week > 0 && <p>در هفته آینده: <strong>{summary.in_a_week}</strong> لغت</p>}
    </div>
  );
}

export default function PracticePage() {
  usePageTitle('تمرین'); // --- اضافه شد
  // ... بقیه کد بدون تغییر ...
  const { isAuthenticated } = useAuth();
  const [reviewWords, setReviewWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialWordCount, setInitialWordCount] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [upcomingSummary, setUpcomingSummary] = useState(null);

  const fetchAllData = () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      axiosInstance.get('/progress/review-list/'),
      axiosInstance.get('/progress/upcoming-reviews/')
    ]).then(([reviewResponse, upcomingResponse]) => {
      setReviewWords(reviewResponse.data);
      setInitialWordCount(reviewResponse.data.length);
      setUpcomingSummary(upcomingResponse.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAllData();
  }, [isAuthenticated]);

  const handleAction = (userWordId, action) => {
    if (action === 'know') {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    axiosInstance.post(`/progress/my-words/${userWordId}/${action}/`);
    setTimeout(() => {
      setReviewWords(currentWords => currentWords.filter(uw => uw.id !== userWordId));
    }, 300);
  };

  if (!isAuthenticated) {
    return <AuthCallToAction 
              icon="🎯"
              title="آماده‌ای برای تمرین؟"
              message="برای مرور لغات و شروع تمرین، اول باید وارد حسابت بشی."
            />;
  }
  
  if (loading) {
    return <p className={styles.loadingText}>در حال آماده‌سازی تمرین...</p>;
  }

  const answeredCount = initialWordCount - reviewWords.length;
  const progressPercent = initialWordCount > 0 ? (answeredCount / initialWordCount) * 100 : 0;

  return (
    <div className={styles.practiceContainer}>
      <h2 className={styles.title}>تمرین و مرور</h2>
      {initialWordCount > 0 ? (
        <div className={styles.practiceSession}>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${progressPercent}%` }}></div>
          </div>

          {reviewWords.length > 0 ? (
            <>
              <div className={styles.flashcardArea}>
                {showParticles && (
                  <div className={styles.particles}>
                    {Array.from({ length: 20 }).map((_, i) => (
                       <div key={i} className={styles.particle} style={{
                           '--angle': `${Math.random() * 360}deg`,
                           '--distance': `${Math.random() * 80 + 50}px`,
                           '--duration': `${Math.random() * 0.5 + 0.7}s`,
                           '--size': `${Math.random() * 3 + 2}px`
                       }}/>
                    ))}
                  </div>
                )}
                <Flashcard key={reviewWords[0].id} word={reviewWords[0].word} />
              </div>
              
              <div className={styles.actionButtons}>
                <button onClick={() => handleAction(reviewWords[0].id, 'forget')} className={`${styles.btnAction} ${styles.btnForget}`}>
                  <FaTimesCircle />
                </button>
                <button onClick={() => handleAction(reviewWords[0].id, 'know')} className={`${styles.btnAction} ${styles.btnKnow}`}>
                  <FaCheckCircle />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.completionMessage}>
              <FaRocket className={styles.rocketIcon} />
              <h3>🎉 آفرین! مرحله تمام شد 🎉</h3>
              <p>تمام لغات این بخش را مرور کردی.</p>
              {upcomingSummary && <UpcomingReviews summary={upcomingSummary} />}
            </div>
          )}
        </div>
      ) : (
         <div className={styles.completionMessage}>
            <p>فعلاً لغتی برای مرور نداری.</p>
            {upcomingSummary && <UpcomingReviews summary={upcomingSummary} />}
         </div>
      )}
    </div>
  );
}