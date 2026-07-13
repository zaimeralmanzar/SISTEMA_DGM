import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface Props { title: string; onClose: () => void; children: ReactNode; size?: 'sm' | 'md' | 'lg'; }

export function Modal({ title, onClose, children, size = 'md' }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`${styles.modal} ${styles[size]}`}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
