import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '../../services';
import type { ApplicationStatus, Application } from '../../models';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import { Alert } from '../../components/common/Alert';
import { formatCurrency, formatDate } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { NotFoundPage } from '../public/NotFoundPage';
import { Check, Eye, X } from 'lucide-react';
import styles from './AnalystApplicationDetailPage.module.css';

const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ['under_review'],
  under_review: ['approved', 'observed', 'rejected'],
  correction_sent: ['under_review', 'approved', 'observed', 'rejected'],
  observed: ['under_review'],
  approved: ['pending_payment'],
  pending_payment: ['paid'],
  paid: ['document_issued'],
  document_issued: ['delivered'],
  draft: [],
  delivered: [],
  rejected: [],
  expired: [],
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: 'Enviada', under_review: 'En revisión', observed: 'Observar', approved: 'Aprobar',
  correction_sent: 'Corrección enviada', pending_payment: 'Pendiente de pago', paid: 'Pagada',
  document_issued: 'Documento emitido', delivered: 'Entregada', rejected: 'Rechazar',
  draft: 'Borrador', expired: 'Caducada',
};

export function AnalystApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(() => applicationService.getById(applicationId ?? ''));
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!app || !user) return <NotFoundPage />;

  const transitions = ALLOWED_TRANSITIONS[app.status] ?? [];

  const handleTransition = (newStatus: ApplicationStatus) => {
    if (!comment.trim() && (newStatus === 'observed' || newStatus === 'rejected')) {
      setError('El comentario es obligatorio para observar o rechazar.');
      return;
    }
    const updated = applicationService.updateStatus(app.id, newStatus, comment, `${user.firstName} ${user.lastName}`);
    setApp(updated);
    setSuccess(`Estado actualizado a: ${STATUS_LABEL[newStatus]}`);
    setComment('');
    setError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <button className={styles.back} onClick={() => navigate('/analista/solicitudes')}>← Solicitudes</button>
        <div className={styles.headerInfo}>
          <div>
            <h1 className={styles.title}>{app.serviceName}</h1>
            <p className={styles.trackNum}>{app.trackingNumber}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Actions */}
          {transitions.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Acciones disponibles</h2>
              <div className={styles.commentBox}>
                <label htmlFor="analystComment" className={styles.commentLabel}>Comentario (obligatorio para observar/rechazar)</label>
                <textarea id="analystComment" className={styles.textarea} value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Explica el motivo de la acción..." />
              </div>
              <div className={styles.actionBtns}>
                {transitions.includes('approved') && (
                  <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleTransition('approved')}>
                    <Check size={16} /> Aprobar
                  </button>
                )}
                {transitions.includes('observed') && (
                  <button className={`${styles.actionBtn} ${styles.observeBtn}`} onClick={() => handleTransition('observed')}>
                    <Eye size={16} /> Observar
                  </button>
                )}
                {transitions.includes('rejected') && (
                  <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleTransition('rejected')}>
                    <X size={16} /> Rechazar
                  </button>
                )}
                {transitions.filter(t => !['approved', 'observed', 'rejected'].includes(t)).map(t => (
                  <button key={t} className={`${styles.actionBtn} ${styles.neutralBtn}`} onClick={() => handleTransition(t)}>
                    {STATUS_LABEL[t]}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Documentos del expediente</h2>
            {app.documents.length === 0 ? (
              <p className={styles.emptyText}>No hay documentos adjuntos.</p>
            ) : (
              <div className={styles.docList}>
                {app.documents.map(doc => (
                  <div key={doc.id} className={`${styles.docItem} ${styles[doc.status]}`}>
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{doc.name}</span>
                      <span className={styles.docFile}>{doc.fileName} · {(doc.size / 1024).toFixed(0)} KB</span>
                      {doc.observation && <span className={styles.docObs}>{doc.observation}</span>}
                    </div>
                    <span className={`${styles.docBadge} ${styles[doc.status]}`}>
                      {doc.status === 'approved' ? 'Aprobado' : doc.status === 'rejected' ? 'Observado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Timeline */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Historial de acciones</h2>
            <Timeline events={app.timeline} />
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Datos del solicitante</h3>
            <dl className={styles.dl}>
              <div><dt>Nombre</dt><dd>{app.personalData.firstName} {app.personalData.lastName}</dd></div>
              <div><dt>Pasaporte</dt><dd>{app.personalData.passport}</dd></div>
              <div><dt>Nacionalidad</dt><dd>{app.personalData.nationality}</dd></div>
              <div><dt>Teléfono</dt><dd>{app.personalData.phone}</dd></div>
              <div><dt>Correo</dt><dd>{app.personalData.email}</dd></div>
            </dl>
          </div>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Información migratoria</h3>
            <dl className={styles.dl}>
              <div><dt>Tipo de trámite</dt><dd>{app.migratoryData.tramiteType}</dd></div>
              <div><dt>Categoría actual</dt><dd>{app.migratoryData.currentCategory}</dd></div>
              <div><dt>Fecha de entrada</dt><dd>{app.migratoryData.entryDate ? formatDate(app.migratoryData.entryDate) : '—'}</dd></div>
              <div><dt>Venc. pasaporte</dt><dd>{app.migratoryData.passportExpiry ? formatDate(app.migratoryData.passportExpiry) : '—'}</dd></div>
              {app.migratoryData.carnetNumber && <div><dt>N° carnet</dt><dd>{app.migratoryData.carnetNumber}</dd></div>}
              <div><dt>Motivo</dt><dd>{app.migratoryData.reason}</dd></div>
            </dl>
          </div>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Resumen</h3>
            <dl className={styles.dl}>
              <div><dt>Número</dt><dd>{app.trackingNumber}</dd></div>
              <div><dt>Servicio</dt><dd>{app.serviceName}</dd></div>
              <div><dt>Oficina</dt><dd>{app.officeName}</dd></div>
              <div><dt>Monto</dt><dd>{formatCurrency(app.amount)}</dd></div>
              <div><dt>Creado</dt><dd>{formatDate(app.createdAt)}</dd></div>
              <div><dt>Estado</dt><dd><StatusBadge status={app.status} /></dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
