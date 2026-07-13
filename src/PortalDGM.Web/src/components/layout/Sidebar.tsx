import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, CalendarCheck, CreditCard,
  Bell, User, Ticket, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import styles from './Sidebar.module.css';

interface Props { open: boolean; onClose: () => void; }

const NAV_ITEMS = [
  { to: '/portal', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/portal/tramites', label: 'Mis trámites', icon: FileText },
  { to: '/portal/citas', label: 'Mis citas', icon: CalendarCheck },
  { to: '/portal/pagos', label: 'Pagos', icon: CreditCard },
  { to: '/portal/notificaciones', label: 'Notificaciones', icon: Bell },
  { to: '/portal/eticket', label: 'E-Ticket', icon: Ticket },
  { to: '/portal/perfil', label: 'Mi perfil', icon: User },
];

export function Sidebar({ open, onClose }: Props) {
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Menú de navegación">
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>DGM</span>
            <span className={styles.logoText}>Portal Ciudadano</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              onClick={onClose}
            >
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
              {item.to === '/portal/notificaciones' && unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <button className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </aside>
    </>
  );
}
