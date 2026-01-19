import React, { useState } from 'react';
import styles from './Quiz.module.css';

/**
 * MCQ Quiz Component
 * 
 * Usage in MDX:
 * <Quiz questions={[
 *   { question: "What is 2+2?", options: ["3", "4", "5"], answer: 1 },
 *   { question: "Capital of France?", options: ["London", "Berlin", "Paris"], answer: 2 }
 * ]} />
 */
export default function Quiz({ questions = [], title = "Quick Quiz" }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const progress = Math.round(((Object.keys(answers).length) / questions.length) * 100);

  return (
    <div className={styles.quizCard}>
      <div className={styles.quizHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>🎯 {title}</h3>
          <span className={styles.progressText}>{Object.keys(answers).length}/{questions.length}</span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className={styles.questionsList}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className={styles.questionBlock}>
            <p className={styles.questionText}>
              <span className={styles.questionNumber}>{qIndex + 1}</span>
              {q.question}
            </p>
            <div className={styles.optionsGrid}>
              {q.options.map((opt, optIndex) => {
                const isSelected = answers[qIndex] === optIndex;
                const isCorrect = q.answer === optIndex;
                let optionClass = styles.optionBtn;
                
                if (submitted) {
                  if (isCorrect) optionClass += ` ${styles.correct}`;
                  else if (isSelected && !isCorrect) optionClass += ` ${styles.incorrect}`;
                  else optionClass += ` ${styles.dimmed}`;
                } else if (isSelected) {
                  optionClass += ` ${styles.selected}`;
                }
                
                return (
                  <button
                    key={optIndex}
                    className={optionClass}
                    onClick={() => handleSelect(qIndex, optIndex)}
                    disabled={submitted}
                  >
                    <span className={styles.optionMarker}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    {opt}
                    {submitted && isCorrect && <span className={styles.icon}>✅</span>}
                    {submitted && isSelected && !isCorrect && <span className={styles.icon}>❌</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        {!submitted ? (
          <button 
            className={`${styles.actionBtn} ${styles.submitBtn}`}
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
          >
            Submit Quiz 🚀
          </button>
        ) : (
          <div className={styles.resultContainer}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{Math.round((score / questions.length) * 100)}%</span>
            </div>
            <div className={styles.resultText}>
              <h4>{score === questions.length ? "Perfect Score! 🏆" : "Well Done! 👏"}</h4>
              <p>You got {score} out of {questions.length} correct</p>
            </div>
            <button className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={handleReset}>
              Try Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
