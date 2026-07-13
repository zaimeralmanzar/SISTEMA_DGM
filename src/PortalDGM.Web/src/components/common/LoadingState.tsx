import styles from './LoadingState.module.css';

interface Props { message?: string; }

export function LoadingState({ message = 'Cargando...' }: Props) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
