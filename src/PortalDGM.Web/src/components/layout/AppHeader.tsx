import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import styles from './AppHeader.module.css';

interface Props { onMenuToggle: () => void; }

export function AppHeader({ onMenuToggle }: Props) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Abrir menú"><Menu size={22} /></button>
      <div className={styles.brand}>Portal Ciudadano — DGM</div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => navigate('/portal/notificaciones')} aria-label={`Notificaciones (${unreadCount} sin leer)`}>
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.dot} aria-hidden="true">{unreadCount}</span>}
        </button>
        <div className={styles.userMenu} ref={menuRef}>
          <button className={styles.userBtn} onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-haspopup="true">
            <span className={styles.avatar}><User size={16} /></span>
            <span className={styles.userName}>{user?.firstName}</span>
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <button role="menuitem" onClick={() => { navigate('/portal/perfil'); setMenuOpen(false); }}>Mi perfil</button>
              <hr />
              <button role="menuitem" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
