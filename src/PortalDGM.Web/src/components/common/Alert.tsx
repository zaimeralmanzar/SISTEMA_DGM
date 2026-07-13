import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import styles from './Alert.module.css';

type AlertType = 'success' | 'warning' | 'error' | 'info';

interface Props {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

const ICONS = { success: CheckCircle, warning: AlertTriangle, error: XCircle, info: Info };

export function Alert({ type, title, message, onClose }: Props) {
  const Icon = ICONS[type];
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <Icon size={18} className={styles.icon} aria-hidden="true" />
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Cerrar alerta">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
