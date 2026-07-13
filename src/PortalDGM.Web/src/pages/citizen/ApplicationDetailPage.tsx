import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService, paymentService } from '../../services';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import { Alert } from '../../components/common/Alert';
import { FileUploader } from '../../components/forms/FileUploader';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/validation';
import { NotFoundPage } from '../public/NotFoundPage';
import { FileText, CreditCard, Calendar } from 'lucide-react';
import styles from './ApplicationDetailPage.module.css';

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState(() => applicationService.getById(applicationId ?? ''));
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionFiles, setCorrectionFiles] = useState<{ file: File; valid: boolean }[]>([]);
  const [correctionSent, setCorrectionSent] = useState(false);

  if (!app) return <NotFoundPage />;

  const payment = app.paymentOrderId ? paymentService.getByApplication(app.id) : null;

  const sendCorrection = () => {
    if (!correctionFiles.every(f => f.valid)) return;
    const updated = applicationService.updateStatus(app.id, 'correction_sent', 'Corrección enviada por el ciudadano', 'Ciudadano');
    setApp(updated);
    setCorrectionSent(true);
    setShowCorrection(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <button className={styles.back} onClick={() => navigate('/portal/tramites')}>← Mis trámites</button>
        <div className={styles.headerInfo}>
          <div>
            <h1 className={styles.title}>{app.serviceName}</h1>
            <p className={styles.trackNum}>{app.trackingNumber}</p>
            <p className={styles.date}>Creado: {formatDate(app.createdAt)}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {correctionSent && <Alert type="success" title="Corrección enviada" message="Tu corrección ha sido enviada exitosamente. El analista la revisará." />}

      {app.status === 'observed' && !correctionSent && (
        <Alert
          type="warning"
          title="Solicitud observada"
          message={`El analista ha solicitado correcciones: ${app.analystComment ?? ''}`}
        />
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Status & next step */}
          {app.nextStep && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Próximo paso</h2>
              <p className={styles.nextStep}>{app.nextStep}</p>
            </section>
          )}

          {/* Documents */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}><FileText size={16} /> Documentos</h2>
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
                    <span className={`${styles.docStatus} ${styles[doc.status]}`}>{doc.status === 'approved' ? 'Aprobado' : doc.status === 'rejected' ? 'Observado' : 'Pendiente'}</span>
                  </div>
                ))}
              </div>
            )}
            {app.status === 'observed' && !correctionSent && (
              <button className={styles.correctionBtn} onClick={() => setShowCorrection(s => !s)}>
                {showCorrection ? 'Cancelar corrección' : 'Corregir documentos observados'}
              </button>
            )}
            {showCorrection && (
              <div className={styles.correctionBox}>
                <FileUploader label="Sube los documentos corregidos (JPG/JPEG)" onFilesChange={setCorrectionFiles} />
                <button className={styles.sendBtn} onClick={sendCorrection} disabled={correctionFiles.length === 0 || !correctionFiles.every(f => f.valid)}>
                  Enviar corrección
                </button>
              </div>
            )}
          </section>

          {/* Personal data summary */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Datos personales</h2>
            <dl className={styles.dl}>
              <div><dt>Nombre</dt><dd>{app.personalData.firstName} {app.personalData.lastName}</dd></div>
              <div><dt>Pasaporte</dt><dd>{app.personalData.passport}</dd></div>
              <div><dt>Nacionalidad</dt><dd>{app.personalData.nationality}</dd></div>
              <div><dt>Teléfono</dt><dd>{app.personalData.phone}</dd></div>
            </dl>
          </section>

          {/* Timeline */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Historial</h2>
            <Timeline events={app.timeline} />
          </section>
        </div>

        <aside className={styles.aside}>
          {/* Payment */}
          {payment && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}><CreditCard size={16} /> Pago</h3>
              <dl className={styles.dl}>
                <div><dt>Orden</dt><dd>{payment.orderNumber}</dd></div>
                <div><dt>Concepto</dt><dd>{payment.concept}</dd></div>
                <div><dt>Monto</dt><dd>{formatCurrency(payment.amount)}</dd></div>
                <div><dt>Estado</dt><dd>{payment.status === 'paid' ? '✓ Pagado' : 'Pendiente'}</dd></div>
                {payment.paidAt && <div><dt>Fecha de pago</dt><dd>{formatDateTime(payment.paidAt)}</dd></div>}
              </dl>
              {payment.status === 'pending' && (
                <button className={styles.payBtn} onClick={() => navigate('/portal/pagos')}>Ir a pagos</button>
              )}
            </div>
          )}

          {/* Analyst comment */}
          {app.analystComment && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Comentario del analista</h3>
              <p className={styles.analystComment}>{app.analystComment}</p>
            </div>
          )}

          {/* Summary */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Resumen</h3>
            <dl className={styles.dl}>
              <div><dt>Número</dt><dd>{app.trackingNumber}</dd></div>
              <div><dt>Servicio</dt><dd>{app.serviceName}</dd></div>
              <div><dt>Oficina</dt><dd>{app.officeName}</dd></div>
              <div><dt>Monto</dt><dd>{formatCurrency(app.amount)}</dd></div>
              <div><dt>Estado</dt><dd><StatusBadge status={app.status} /></dd></div>
            </dl>
          </div>

          {app.appointmentId && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}><Calendar size={16} /> Cita</h3>
              <button className={styles.viewLink} onClick={() => navigate('/portal/citas')}>Ver cita agendada →</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
