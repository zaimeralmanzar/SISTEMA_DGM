import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/validation';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './AnalystDashboard.module.css';

export function AnalystDashboard() {
  const navigate = useNavigate();
  const all = applicationService.getAll();
  const pending = all.filter(a => a.status === 'submitted' || a.status === 'under_review' || a.status === 'correction_sent');
  const observed = all.filter(a => a.status === 'observed');
  const approved = all.filter(a => ['approved', 'paid', 'document_issued', 'delivered'].includes(a.status));
  const recent = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard — Analista de Extranjería</h1>
      <div className={styles.stats}>
        <div className={styles.statCard} onClick={() => navigate('/analista/solicitudes')}>
          <Clock size={24} className={styles.statIcon} style={{ color: 'var(--color-warning)' }} />
          <div><span className={styles.statVal}>{pending.length}</span><span className={styles.statLabel}>Pendientes de revisión</span></div>
        </div>
        <div className={styles.statCard}>
          <AlertTriangle size={24} className={styles.statIcon} style={{ color: 'var(--color-error)' }} />
          <div><span className={styles.statVal}>{observed.length}</span><span className={styles.statLabel}>Observadas</span></div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={24} className={styles.statIcon} style={{ color: 'var(--color-success)' }} />
          <div><span className={styles.statVal}>{approved.length}</span><span className={styles.statLabel}>Aprobadas</span></div>
        </div>
        <div className={styles.statCard}>
          <FileText size={24} className={styles.statIcon} />
          <div><span className={styles.statVal}>{all.length}</span><span className={styles.statLabel}>Total solicitudes</span></div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Solicitudes recientes</h2>
          <button className={styles.seeAll} onClick={() => navigate('/analista/solicitudes')}>Ver todas</button>
        </div>
        <div className={styles.list}>
          {recent.map(app => (
            <div key={app.id} className={styles.item} onClick={() => navigate(`/analista/solicitudes/${app.id}`)}>
              <div className={styles.itemInfo}>
                <span className={styles.trackNum}>{app.trackingNumber}</span>
                <span className={styles.serviceName}>{app.serviceName}</span>
                <span className={styles.meta}>{formatDate(app.updatedAt)} · {app.officeName}</span>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
