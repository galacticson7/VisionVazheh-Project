// src/components/Flashcard.jsx
import { useState, useEffect, useCallback } from 'react';
import styles from './Flashcard.module.css';
import { FiVolume2 } from 'react-icons/fi';

export default function Flashcard({ word }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = useCallback((event) => {
    event.stopPropagation();
    if (word && word.audio_pronunciation) {
      const audio = new Audio(word.audio_pronunciation);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [word]);

  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  if (!word) { return null; }

  return (
    <div className={styles.flashcard} onClick={handleFlip}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.isFlipped : ''}`}>
        <div className={styles.cardFace + ' ' + styles.cardFront}>
          {word.audio_pronunciation && (
            <button className={styles.audioButton} onClick={handlePlayAudio}>
              <FiVolume2 />
            </button>
          )}
          <div className={styles.wordContent}>
            <p className={styles.phonetic}>{word.phonetic || ' '}</p>
            <h2 className={styles.word}>{word.english_word}</h2>
          </div>
          <span className={styles.flipHint}>(برای مشاهده معنی کلیک کنید)</span>
        </div>
        <div className={styles.cardFace + ' ' + styles.cardBack}>
          <div className={styles.wordContent}>
            <h2 className={styles.word}>{word.persian_meaning}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}