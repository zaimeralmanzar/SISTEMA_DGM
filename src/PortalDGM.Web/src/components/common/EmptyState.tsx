import { FileX } from 'lucide-react';
import styles from './EmptyState.module.css';

interface Props { title?: string; message?: string; action?: { label: string; onClick: () => void }; }

export function EmptyState({ title = 'Sin resultados', message = 'No hay datos para mostrar.', action }: Props) {
  return (
    <div className={styles.wrapper}>
      <FileX size={48} className={styles.icon} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {action && <button className={styles.btn} onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}
