import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './FormField.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  children?: ReactNode;
}

export function FormField({ label, error, hint, id, children, ...inputProps }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}{inputProps.required && <span className={styles.required} aria-hidden="true"> *</span>}</label>
      {children ?? <input id={id} className={`${styles.input} ${error ? styles.hasError : ''}`} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} aria-invalid={!!error} {...inputProps} />}
      {hint && !error && <span id={`${id}-hint`} className={styles.hint}>{hint}</span>}
      {error && <span id={`${id}-error`} className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
