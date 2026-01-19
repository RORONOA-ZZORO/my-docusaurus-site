import React, { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

/**
 * Interactive Calculator Component
 * 
 * Usage in MDX:
 * <Calculator 
 *   title="Ohm's Law Calculator"
 *   formula="V = I × R"
 *   inputs={[
 *     { name: "I", label: "Current (A)", default: 2 },
 *     { name: "R", label: "Resistance (Ω)", default: 5 }
 *   ]}
 *   calculate={(values) => values.I * values.R}
 *   resultLabel="Voltage (V)"
 * />
 */
export default function Calculator({ 
  title = "Calculator",
  formula = "",
  inputs = [],
  calculate,
  resultLabel = "Result"
}) {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);

  // Initialize default values
  useEffect(() => {
    const defaults = {};
    inputs.forEach(input => {
      defaults[input.name] = input.default || 0;
    });
    setValues(defaults);
  }, []);

  // Calculate result when values change
  useEffect(() => {
    if (calculate && Object.keys(values).length > 0) {
      try {
        const res = calculate(values);
        setResult(typeof res === 'number' ? res.toFixed(2) : res);
      } catch (e) {
        setResult('Error');
      }
    }
  }, [values, calculate]);

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: parseFloat(value) || 0 });
  };

  return (
    <div className={styles.calcCard}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>🧮</div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{title}</h3>
          {formula && <code className={styles.formula}>{formula}</code>}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.inputsGrid}>
          {inputs.map((input) => (
            <div key={input.name} className={styles.inputGroup}>
              <label htmlFor={input.name} className={styles.label}>{input.label}</label>
              <div className={styles.inputWrapper}>
                <input
                  id={input.name}
                  type="number"
                  className={styles.input}
                  value={values[input.name] || ''}
                  onChange={(e) => handleChange(input.name, e.target.value)}
                  step="any"
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.resultContainer}>
          <span className={styles.resultLabel}>{resultLabel}</span>
          <div className={styles.resultDisplay}>
            {result ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
