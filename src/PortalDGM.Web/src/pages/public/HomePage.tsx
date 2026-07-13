import { useNavigate } from 'react-router-dom';
import { Shield, FileText, CheckCircle, ArrowRight, Ticket, Calculator, Search } from 'lucide-react';
import { SERVICES } from '../../data';
import styles from './HomePage.module.css';

const FEATURED_SERVICES = SERVICES.slice(0, 6);

const STEPS = [
  { num: '01', title: 'Crea tu cuenta', desc: 'Regístrate con tu pasaporte o cédula y datos personales.' },
  { num: '02', title: 'Selecciona el servicio', desc: 'Elige el trámite migratorio que necesitas del catálogo.' },
  { num: '03', title: 'Sube los documentos', desc: 'Adjunta los documentos requeridos en formato JPG.' },
  { num: '04', title: 'Agenda tu cita', desc: 'Selecciona la oficina, fecha y horario de tu preferencia.' },
  { num: '05', title: 'Realiza el pago', desc: 'Paga las tasas correspondientes de forma segura.' },
  { num: '06', title: 'Recibe tu documento', desc: 'Recibe tu carnet o resolución en la oficina indicada.' },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}><Shield size={14} /> Sistema oficial de gestión migratoria</div>
          <h1 className={styles.heroTitle}>Portal de Servicios Migratorios</h1>
          <p className={styles.heroSub}>
            Realiza tus trámites migratorios de manera digital. Residencias, renovaciones, citas y más desde la comodidad de tu hogar.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.heroPrimary} onClick={() => navigate('/registro')}>
              Comenzar trámite <ArrowRight size={16} />
            </button>
            <button className={styles.heroSecondary} onClick={() => navigate('/servicios')}>
              Ver servicios
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><strong>12+</strong><span>Servicios disponibles</span></div>
            <div className={styles.stat}><strong>5</strong><span>Oficinas</span></div>
            <div className={styles.stat}><strong>24/7</strong><span>Disponibilidad</span></div>
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className={styles.quickAccess}>
        <div className={styles.container}>
          <div className={styles.quickGrid}>
            <button className={styles.quickCard} onClick={() => navigate('/eticket')}>
              <Ticket size={28} className={styles.quickIcon} />
              <span>E-Ticket</span>
              <small>Formulario de entrada/salida</small>
            </button>
            <button className={styles.quickCard} onClick={() => navigate('/calculadora-estadia')}>
              <Calculator size={28} className={styles.quickIcon} />
              <span>Calculadora</span>
              <small>Calcular sobreestadía</small>
            </button>
            <button className={styles.quickCard} onClick={() => navigate('/verificar-documento')}>
              <Search size={28} className={styles.quickIcon} />
              <span>Verificar</span>
              <small>Consultar documentos</small>
            </button>
            <button className={styles.quickCard} onClick={() => navigate('/login')}>
              <FileText size={28} className={styles.quickIcon} />
              <span>Mis trámites</span>
              <small>Gestionar solicitudes</small>
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Servicios disponibles</h2>
            <p className={styles.sectionSub}>Trámites migratorios que puedes iniciar desde el portal</p>
          </div>
          <div className={styles.servicesGrid}>
            {FEATURED_SERVICES.map(service => (
              <div key={service.id} className={styles.serviceCard} onClick={() => navigate(`/servicios/${service.id}`)}>
                <div className={styles.serviceCode}>{service.code}</div>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDesc}>{service.description.slice(0, 90)}...</p>
                <div className={styles.serviceMeta}>
                  <span className={styles.serviceCategory}>{service.category}</span>
                  <span className={styles.serviceTime}>{service.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.seeAll}>
            <button className={styles.seeAllBtn} onClick={() => navigate('/servicios')}>Ver todos los servicios <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
            <p className={styles.sectionSub}>Proceso simple en 6 pasos para gestionar tu trámite migratorio</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map(step => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <CheckCircle size={40} className={styles.ctaIcon} />
            <h2 className={styles.ctaTitle}>Comienza tu trámite hoy</h2>
            <p className={styles.ctaSub}>Regístrate y accede a todos los servicios migratorios desde cualquier dispositivo.</p>
            <div className={styles.ctaActions}>
              <button className={styles.ctaPrimary} onClick={() => navigate('/registro')}>Crear cuenta <ArrowRight size={16} /></button>
              <button className={styles.ctaSecondary} onClick={() => navigate('/login')}>Ya tengo cuenta</button>
            </div>
            <p className={styles.disclaimer}>⚠️ Portal académico de demostración — Los datos son simulados</p>
          </div>
        </div>
      </section>
    </div>
  );
}
