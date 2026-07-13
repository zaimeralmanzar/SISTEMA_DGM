import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import styles from './AnalystLayout.module.css';

export function AnalystLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className={styles.wrapper}>
        <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>DGM</span>
              <span className={styles.logoText}>Analista</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar"><X size={20} /></button>
          </div>
          <nav className={styles.nav}>
            <NavLink to="/analista" end className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} onClick={() => setOpen(false)}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/analista/solicitudes" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} onClick={() => setOpen(false)}>
              <FileText size={18} /> Solicitudes
            </NavLink>
          </nav>
          <button className={styles.logout} onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </aside>
        <div className={styles.main}>
          <header className={styles.topbar}>
            <button className={styles.menuBtn} onClick={() => setOpen(o => !o)} aria-label="Menú"><Menu size={22} /></button>
            <span className={styles.brand}>Portal Analista — DGM</span>
          </header>
          <main className={styles.content} id="main-content"><Outlet /></main>
        </div>
      </div>
    </NotificationProvider>
  );
}
