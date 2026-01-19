import React, { useState } from 'react';
import styles from './CodeChecker.module.css';

/**
 * Code Syntax Checker Component
 * 
 * Usage in MDX:
 * <CodeChecker 
 *   language="c"
 *   placeholder="// Write your C code here..."
 *   checks={["semicolons", "brackets", "printf"]}
 * />
 */
export default function CodeChecker({ 
  language = "c",
  placeholder = "// Write your code here...",
  checks = ["semicolons", "brackets"]
}) {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(null);

  const checkCode = () => {
    const foundErrors = [];
    
    if (checks.includes('semicolons')) {
      const lines = code.split('\n');
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.length > 0 && 
            !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && 
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('#') &&
            !trimmed.startsWith('/*') &&
            !trimmed.endsWith('*/') &&
            !trimmed.includes('if') &&
            !trimmed.includes('else') &&
            !trimmed.includes('for') &&
            !trimmed.includes('while')) {
          foundErrors.push({ line: i + 1, msg: "Expected ';'" });
        }
      });
    }

    if (checks.includes('brackets')) {
      const open = (code.match(/\{/g) || []).length;
      const close = (code.match(/\}/g) || []).length;
      if (open !== close) {
        foundErrors.push({ line: '-', msg: `Unbalanced braces: ${open} '{' vs ${close} '}'` });
      }
      
      const openParen = (code.match(/\(/g) || []).length;
      const closeParen = (code.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        foundErrors.push({ line: '-', msg: `Unbalanced parenthesis: ${openParen} '(' vs ${closeParen} ')'` });
      }
    }

    if (checks.includes('printf') && language === 'c') {
      if (code.includes('printf') && !code.includes('#include')) {
        foundErrors.push({ line: 1, msg: "Missing #include <stdio.h>" });
      }
    }

    if (checks.includes('main') && language === 'c') {
      if (!code.includes('main')) {
        foundErrors.push({ line: '-', msg: "Missing entry point: int main()" });
      }
    }

    setErrors(foundErrors);
    setIsValid(foundErrors.length === 0 && code.trim().length > 0);
  };

  return (
    <div className={styles.editorCard}>
      <div className={styles.toolbar}>
        <div className={styles.windowControls}>
          <span className={styles.dot} style={{ background: '#FF5F56' }}></span>
          <span className={styles.dot} style={{ background: '#FFBD2E' }}></span>
          <span className={styles.dot} style={{ background: '#27C93F' }}></span>
        </div>
        <div className={styles.filename}>
          example.{language === 'c' ? 'c' : 'txt'}
        </div>
        <div className={styles.actions}>
          <button className={styles.runBtn} onClick={checkCode}>
            ▶ Run Check
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.lineNumbers}>
          {code.split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          className={styles.codeArea}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setIsValid(null);
            setErrors([]);
          }}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>

      {(isValid !== null || errors.length > 0) && (
        <div className={`${styles.feedback} ${isValid ? styles.success : styles.error}`}>
          <div className={styles.statusHeader}>
            {isValid ? 'BUILD SUCCESSFUL' : 'BUILD FAILED'}
          </div>
          {isValid ? (
             <div className={styles.message}>
               No syntax errors found. Ready to compile!
             </div>
          ) : (
            <div className={styles.errorList}>
              {errors.map((err, i) => (
                <div key={i} className={styles.errorItem}>
                  <span className={styles.errorIcon}>✖</span>
                  <span className={styles.errorLoc}>
                    {err.line !== '-' ? `Line ${err.line}:` : ''}
                  </span>
                  <span className={styles.errorMsg}>{err.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
