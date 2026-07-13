import { useParams, useNavigate } from 'react-router-dom';
import { serviceCatalogService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/validation';
import { NotFoundPage } from './NotFoundPage';
import { AlertTriangle, CheckCircle, FileText, Clock, MapPin, Users } from 'lucide-react';
import styles from './ServiceDetailPage.module.css';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = serviceCatalogService.getById(serviceId ?? '');
  if (!service) return <NotFoundPage />;

  const handleStart = () => {
    if (!user) { navigate('/login', { state: { from: `/portal/tramites/nuevo/${service.id}` } }); return; }
    if (user.role !== 'citizen') return;
    navigate(`/portal/tramites/nuevo/${service.id}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <button className={styles.back} onClick={() => navigate('/servicios')}>← Volver al catálogo</button>
          <span className={styles.code}>{service.code}</span>
          <h1 className={styles.title}>{service.name}</h1>
          <span className={styles.cat}>{service.category}</span>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Descripción</h2>
              <p>{service.description}</p>
            </section>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><Users size={16} /> Público objetivo</h2>
              <p>{service.targetAudience}</p>
            </section>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><CheckCircle size={16} /> Requisitos</h2>
              <ul className={styles.list}>{service.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </section>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><FileText size={16} /> Documentos requeridos</h2>
              <ul className={styles.list}>{service.documents.map((d, i) => <li key={i}>{d}</li>)}</ul>
              <p className={styles.note}>Solo se aceptan archivos JPG/JPEG. Máximo 5MB por archivo.</p>
            </section>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Pasos del proceso</h2>
              <ol className={styles.steps}>{service.steps.map((s, i) => <li key={i}><span className={styles.stepNum}>{i + 1}</span>{s}</li>)}</ol>
            </section>
            {service.warnings.length > 0 && (
              <section className={`${styles.card} ${styles.warnings}`}>
                <h2 className={styles.cardTitle}><AlertTriangle size={16} /> Advertencias importantes</h2>
                <ul className={styles.list}>{service.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                <p className={styles.note}>Las validaciones definitivas corresponden al sistema central de la DGM.</p>
              </section>
            )}
          </div>
          <aside className={styles.aside}>
            <div className={styles.summaryCard}>
              <h3>Resumen del servicio</h3>
              <div className={styles.summaryItem}><Clock size={16} /><div><label>Plazo estimado</label><span>{service.responseTime}</span></div></div>
              <div className={styles.summaryItem}><FileText size={16} /><div><label>Costo estimado</label><span>{service.estimatedCost > 0 ? formatCurrency(service.estimatedCost) : 'Gratuito'}</span></div></div>
              <div className={styles.summaryItem}><MapPin size={16} /><div><label>Modalidad</label><span>{service.modality}</span></div></div>
              <button className={styles.startBtn} onClick={handleStart}>Iniciar solicitud</button>
              {!user && <p className={styles.loginNote}>Necesitas iniciar sesión para comenzar</p>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
