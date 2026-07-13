import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface Props { page: number; totalPages: number; onPageChange: (p: number) => void; }

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className={styles.nav} aria-label="Paginación">
      <button className={styles.btn} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Anterior">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} className={`${styles.btn} ${p === page ? styles.active : ''}`} onClick={() => onPageChange(p)} aria-current={p === page ? 'page' : undefined}>{p}</button>
      ))}
      <button className={styles.btn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Siguiente">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
