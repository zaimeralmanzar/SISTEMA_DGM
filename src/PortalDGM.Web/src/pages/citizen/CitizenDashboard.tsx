import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService, notificationService, appointmentService, paymentService } from '../../services';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/validation';
import { FileText, Calendar, CreditCard, Bell, Plus, Ticket, Calculator } from 'lucide-react';
import styles from './CitizenDashboard.module.css';

export function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const apps = applicationService.getByUser(user.id);
  const notifications = notificationService.getByUser(user.id);
  const appointments = appointmentService.getByUser(user.id);
  const payments = paymentService.getByUser(user.id);

  const active = apps.filter(a => !['delivered', 'rejected', 'expired'].includes(a.status));
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const nextAppt = appointments.find(a => a.status === 'scheduled');
  const unread = notifications.filter(n => !n.read).length;
  const recent = [...apps].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

  return (
    <div className={styles.page}>
      <div className={styles.welcomeBar}>
        <div>
          <h1 className={styles.welcome}>Bienvenida, {user.firstName} {user.lastName}</h1>
          <p className={styles.sub}>Portal Ciudadano — Dirección General de Migración</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => navigate('/portal/tramites')}>
          <FileText size={24} className={styles.statIcon} />
          <div className={styles.statInfo}><span className={styles.statValue}>{active.length}</span><span className={styles.statLabel}>Trámites activos</span></div>
        </div>
        <div className={styles.statCard} onClick={() => navigate('/portal/pagos')}>
          <CreditCard size={24} className={styles.statIcon} style={{ color: pendingPayments.length > 0 ? 'var(--color-warning)' : undefined }} />
          <div className={styles.statInfo}><span className={styles.statValue}>{pendingPayments.length}</span><span className={styles.statLabel}>Pagos pendientes</span></div>
        </div>
        <div className={styles.statCard} onClick={() => navigate('/portal/citas')}>
          <Calendar size={24} className={styles.statIcon} />
          <div className={styles.statInfo}><span className={styles.statValue}>{nextAppt ? formatDate(nextAppt.date) : '—'}</span><span className={styles.statLabel}>Próxima cita</span></div>
        </div>
        <div className={styles.statCard} onClick={() => navigate('/portal/notificaciones')}>
          <Bell size={24} className={styles.statIcon} style={{ color: unread > 0 ? 'var(--color-error)' : undefined }} />
          <div className={styles.statInfo}><span className={styles.statValue}>{unread}</span><span className={styles.statLabel}>Notificaciones</span></div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Quick actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Acciones rápidas</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionBtn} onClick={() => navigate('/servicios')}>
              <Plus size={22} /> <span>Nueva solicitud</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/portal/tramites')}>
              <FileText size={22} /> <span>Mis trámites</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/portal/citas')}>
              <Calendar size={22} /> <span>Agendar cita</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/portal/pagos')}>
              <CreditCard size={22} /> <span>Consultar pagos</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/portal/eticket')}>
              <Ticket size={22} /> <span>E-Ticket</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/calculadora-estadia')}>
              <Calculator size={22} /> <span>Calculadora</span>
            </button>
          </div>
        </section>

        {/* Recent applications */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Últimos trámites</h2>
            <button className={styles.seeAll} onClick={() => navigate('/portal/tramites')}>Ver todos</button>
          </div>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              <FileText size={32} className={styles.emptyIcon} />
              <p>No tienes trámites aún.</p>
              <button className={styles.emptyBtn} onClick={() => navigate('/servicios')}>Iniciar solicitud</button>
            </div>
          ) : (
            <div className={styles.appList}>
              {recent.map(app => (
                <div key={app.id} className={styles.appItem} onClick={() => navigate(`/portal/tramites/${app.id}`)}>
                  <div className={styles.appInfo}>
                    <span className={styles.appName}>{app.serviceName}</span>
                    <span className={styles.appNum}>{app.trackingNumber}</span>
                    <span className={styles.appDate}>Actualizado: {formatDate(app.updatedAt)}</span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Notificaciones recientes</h2>
            <button className={styles.seeAll} onClick={() => navigate('/portal/notificaciones')}>Ver todas</button>
          </div>
          {notifications.slice(0, 4).length === 0 ? (
            <p className={styles.noNotif}>Sin notificaciones</p>
          ) : (
            <div className={styles.notifList}>
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
                  <div className={`${styles.notifDot} ${styles[n.type]}`} aria-hidden="true" />
                  <div>
                    <p className={styles.notifTitle}>{n.title}</p>
                    <p className={styles.notifMsg}>{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Next appointment */}
        {nextAppt && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Próxima cita</h2>
            <div className={styles.apptCard}>
              <div className={styles.apptIcon}><Calendar size={28} /></div>
              <div>
                <p className={styles.apptCode}>{nextAppt.code}</p>
                <p className={styles.apptOffice}>{nextAppt.officeName}</p>
                <p className={styles.apptDate}>{formatDate(nextAppt.date)} a las {nextAppt.time}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
