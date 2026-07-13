import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services';
import type { ApplicationStatus } from '../../models';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { STATUS_LABELS } from '../../utils/statusLabels';
import { formatCurrency, formatDate } from '../../utils/validation';
import { Plus } from 'lucide-react';
import styles from './MyApplicationsPage.module.css';

const PAGE_SIZE = 5;

export function MyApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);

  if (!user) return null;
  const all = applicationService.getByUser(user.id);

  const filtered = all.filter(a => {
    const matchQ = !query || a.serviceName.toLowerCase().includes(query.toLowerCase()) || a.trackingNumber.toLowerCase().includes(query.toLowerCase());
    const matchS = !statusFilter || a.status === statusFilter;
    return matchQ && matchS;
  });

  const sorted = [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statuses = Object.entries(STATUS_LABELS) as [ApplicationStatus, string][];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis trámites</h1>
          <p className={styles.sub}>Gestiona y da seguimiento a tus solicitudes</p>
        </div>
        <button className={styles.newBtn} onClick={() => navigate('/servicios')}><Plus size={16} /> Nueva solicitud</button>
      </div>

      <div className={styles.filters}>
        <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} placeholder="Buscar trámite..." />
        <select className={styles.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value as ApplicationStatus | ''); setPage(1); }}>
          <option value="">Todos los estados</option>
          {statuses.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {paged.length === 0 ? (
        <EmptyState title="Sin resultados" message="No hay trámites con los filtros aplicados." action={{ label: 'Iniciar solicitud', onClick: () => navigate('/servicios') }} />
      ) : (
        <>
          <div className={styles.list}>
            {paged.map(app => (
              <div key={app.id} className={styles.card} onClick={() => navigate(`/portal/tramites/${app.id}`)}>
                <div className={styles.cardLeft}>
                  <span className={styles.trackNum}>{app.trackingNumber}</span>
                  <h3 className={styles.serviceName}>{app.serviceName}</h3>
                  <div className={styles.meta}>
                    <span>{formatDate(app.createdAt)}</span>
                    <span>·</span>
                    <span>{app.officeName}</span>
                    <span>·</span>
                    <span>{formatCurrency(app.amount)}</span>
                  </div>
                  {app.nextStep && <p className={styles.nextStep}>Próximo paso: {app.nextStep}</p>}
                </div>
                <div className={styles.cardRight}>
                  <StatusBadge status={app.status} />
                  <span className={styles.viewLink}>Ver detalle →</span>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
