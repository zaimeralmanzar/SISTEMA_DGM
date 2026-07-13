import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

interface Props { value: string; onChange: (v: string) => void; placeholder?: string; }

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }: Props) {
  return (
    <div className={styles.wrapper}>
      <Search size={16} className={styles.icon} aria-hidden="true" />
      <input
        type="search" className={styles.input} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && <button className={styles.clear} onClick={() => onChange('')} aria-label="Limpiar búsqueda"><X size={14} /></button>}
    </div>
  );
}
