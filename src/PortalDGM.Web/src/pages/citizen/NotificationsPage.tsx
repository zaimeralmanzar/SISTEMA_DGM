import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/validation';
import { EmptyState } from '../../components/common/EmptyState';
import styles from './NotificationsPage.module.css';

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markRead, markAllRead } = useNotifications();

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Notificaciones</h1><p className={styles.sub}>{notifications.filter(n => !n.read).length} sin leer</p></div>
        {notifications.some(n => !n.read) && (
          <button className={styles.markAllBtn} onClick={markAllRead}><CheckCheck size={16} /> Marcar todas como leídas</button>
        )}
      </div>
      {notifications.length === 0 ? (
        <EmptyState title="Sin notificaciones" message="No tienes notificaciones." />
      ) : (
        <div className={styles.list}>
          {notifications.map(n => (
            <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`} onClick={() => markRead(n.id)}>
              <Bell size={18} className={`${styles.icon} ${styles[n.type]}`} aria-hidden="true" />
              <div className={styles.content}>
                <p className={styles.notifTitle}>{n.title}</p>
                <p className={styles.message}>{n.message}</p>
                <p className={styles.date}>{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.read && <span className={styles.dot} aria-label="No leída" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
