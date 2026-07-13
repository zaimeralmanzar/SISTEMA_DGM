import { Check } from 'lucide-react';
import styles from './Stepper.module.css';

interface Step { label: string; }
interface Props { steps: Step[]; current: number; }

export function Stepper({ steps, current }: Props) {
  return (
    <nav className={styles.stepper} aria-label="Pasos del formulario">
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className={`${styles.step} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
            <div className={styles.circle} aria-hidden="true">{done ? <Check size={14} /> : idx + 1}</div>
            <span className={styles.label}>{step.label}</span>
            {idx < steps.length - 1 && <div className={`${styles.line} ${done ? styles.doneLine : ''}`} aria-hidden="true" />}
          </div>
        );
      })}
    </nav>
  );
}
