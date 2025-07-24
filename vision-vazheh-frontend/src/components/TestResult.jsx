// src/components/TestResult.jsx
import { Link, useNavigate } from 'react-router-dom';
import styles from './TestResult.module.css';
import { FaRocket, FaRedo } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';

const TestResult = ({ result, lessonId }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // صفحه را دوباره بارگذاری می‌کنیم تا آزمون از نو شروع شود
    window.location.reload();
  };

  return (
    <div className={styles.resultContainer}>
      <FaRocket className={`${styles.headerIcon} ${result.passed ? styles.pass : styles.fail}`} />
      <h2 className={styles.title}>
        {result.passed ? 'ماموریت با موفقیت انجام شد!' : 'نیاز به تلاش بیشتر!'}
      </h2>
      <p className={styles.subtitle}>
        نتیجه آزمون شما برای این درس:
      </p>

      <div className={styles.scoreInfo}>
        <span>نمره: <strong>{result.score} / 100</strong></span>
        <span>پاسخ صحیح: <strong>{result.correct_count} از {result.total_questions}</strong></span>
      </div>

      {result.points_awarded > 0 && (
        <p className={styles.pointsAwarded}>
          ✨ شما {result.points_awarded} امتیاز "گرد و غبار ستاره‌ای" کسب کردید! ✨
        </p>
      )}

      {result.results.some(r => !r.is_correct) && (
        <div className={styles.mistakesSection}>
          <h4 className={styles.mistakesTitle}>مرور اشتباهات:</h4>
          {result.results.filter(r => !r.is_correct).map(item => (
            <div key={item.question_id} className={styles.mistakeItem}>
              <span className={styles.mistakeWord}>{item.correct_answer.english_word}</span>
              <span className={styles.correctMeaning}>{item.correct_answer.persian_meaning}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          <FiHome /> بازگشت به خانه
        </button>
        <button onClick={handleRetry} className="btn btn-neon">
          <FaRedo /> تلاش مجدد
        </button>
      </div>
    </div>
  );
};

export default TestResult;