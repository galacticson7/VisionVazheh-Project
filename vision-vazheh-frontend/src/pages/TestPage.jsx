// src/pages/TestPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import usePageTitle from '../hooks/usePageTitle';
import styles from './TestPage.module.css';
import { FiVolume2 } from 'react-icons/fi';
import TestResult from '../components/TestResult';

// --- ۱. فایل صوتی مستقیماً از پوشه assets ایمپورت می‌شود ---
import correctSoundFile from '../assets/correct_answer.mp3';

export default function TestPage() {
  const { lessonId } = useParams();
  usePageTitle(`آزمون درس ${lessonId}`);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const navigate = useNavigate();

  // --- ۲. از فایل ایمپورت شده برای ساخت صدا استفاده می‌کنیم ---
  const correctSound = useMemo(() => new Audio(correctSoundFile), []);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/lessons/${lessonId}/test/`)
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching test questions:", error);
        setLoading(false);
      });
  }, [lessonId]);

  const handleAnswer = (option) => {
    if (answerStatus) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option.id === currentQuestion.id;

    if (isCorrect) {
      // برای جلوگیری از تداخل، هر بار صدای جدید را از ابتدا پخش می‌کنیم
      correctSound.currentTime = 0;
      correctSound.play().catch(e => console.error("Error playing correct sound:", e));
    }

    setSelectedOptionId(option.id);
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    const newAnswer = {
      id: currentQuestion.id,
      answer_id: option.id
    };

    setTimeout(() => {
      const updatedAnswers = [...userAnswers, newAnswer];
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionId(null);
        setAnswerStatus(null);
      } else {
        submitTest(updatedAnswers);
      }
    }, 1200);
  };

  const submitTest = (finalAnswers) => {
    setLoading(true);
    axiosInstance.post(`/lessons/${lessonId}/test/`, { answers: finalAnswers })
      .then(response => {
        setTestResult(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error submitting test:", error);
        alert("خطایی در ثبت آزمون رخ داد.");
        setLoading(false);
      });
  };
  
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Error playing question audio:", e));
    }
  };

  if (loading) {
    return <p className={styles.loadingText}>در حال آماده‌سازی آزمون...</p>;
  }

  if (testResult) {
    return <TestResult result={testResult} lessonId={lessonId} />;
  }

  if (!questions.length) {
    return <p className={styles.loadingText}>سوالی برای این آزمون یافت نشد.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = (currentQuestionIndex / questions.length) * 100;

  return (
    <div className={styles.testContainer}>
      <h2 className={styles.title}>سوال {currentQuestionIndex + 1} از {questions.length}</h2>
      <div className={styles.progressBar}>
        <div className={styles.cometTrail} style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className={styles.questionCard}>
        {currentQuestion.question_type === 'meaning' ? (
          <>
            <h3 className={styles.questionText}>{currentQuestion.question_data.english_word}</h3>
            <p className={styles.questionHint}>معنی صحیح کدام است؟</p>
          </>
        ) : (
          <div className={styles.questionHint}>
            <button className={styles.audioButton} onClick={() => playAudio(currentQuestion.question_data.audio_pronunciation_url)}>
              <FiVolume2 />
            </button>
            <p>معنی کلمه‌ای که شنیدید کدام است؟</p>
          </div>
        )}
      </div>

      <div className={styles.optionsGrid}>
        {currentQuestion.options.map(option => (
          <button
            key={option.id}
            className={`${styles.optionButton} ${selectedOptionId === option.id ? styles[answerStatus] : ''}`}
            onClick={() => handleAnswer(option)}
            disabled={!!answerStatus}
          >
            {option.persian_meaning}
          </button>
        ))}
      </div>
    </div>
  );
}