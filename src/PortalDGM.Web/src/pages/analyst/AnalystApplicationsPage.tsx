import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services';
import type { ApplicationStatus } from '../../models';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { STATUS_LABELS } from '../../utils/statusLabels';
import { formatDate, formatCurrency } from '../../utils/validation';
import styles from './AnalystApplicationsPage.module.css';

const PAGE_SIZE = 8;

export function AnalystApplicationsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);

  const all = applicationService.getAll();
  const filtered = all.filter(a => {
    const matchQ = !query || a.trackingNumber.toLowerCase().includes(query.toLowerCase()) || a.serviceName.toLowerCase().includes(query.toLowerCase()) || a.personalData.firstName.toLowerCase().includes(query.toLowerCase()) || a.personalData.lastName.toLowerCase().includes(query.toLowerCase());
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
        <h1 className={styles.title}>Solicitudes</h1>
        <p className={styles.sub}>{filtered.length} resultado(s)</p>
      </div>
      <div className={styles.filters}>
        <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} placeholder="Buscar por número, servicio o nombre..." />
        <select className={styles.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value as ApplicationStatus | ''); setPage(1); }}>
          <option value="">Todos los estados</option>
          {statuses.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {paged.length === 0 ? (
        <EmptyState title="Sin resultados" message="No hay solicitudes con los filtros aplicados." />
      ) : (
        <>
          <div className={styles.table}>
            <div className={styles.thead}>
              <span>Número</span><span>Servicio</span><span>Solicitante</span><span>Fecha</span><span>Monto</span><span>Estado</span>
            </div>
            {paged.map(app => (
              <div key={app.id} className={styles.trow} onClick={() => navigate(`/analista/solicitudes/${app.id}`)}>
                <span className={styles.trackNum}>{app.trackingNumber}</span>
                <span className={styles.serviceName}>{app.serviceName}</span>
                <span>{app.personalData.firstName} {app.personalData.lastName}</span>
                <span>{formatDate(app.updatedAt)}</span>
                <span>{formatCurrency(app.amount)}</span>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
