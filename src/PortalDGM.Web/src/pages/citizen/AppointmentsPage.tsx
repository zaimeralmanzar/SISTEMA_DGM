import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService, applicationService } from '../../services';
import { OFFICES } from '../../data/offices';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/validation';
import { Calendar, Plus, X } from 'lucide-react';
import styles from './AppointmentsPage.module.css';

export function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(() => user ? appointmentService.getByUser(user.id) : []);
  const [showBook, setShowBook] = useState(false);
  const [officeId, setOfficeId] = useState(OFFICES[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appId, setAppId] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const userApps = applicationService.getByUser(user.id).filter(a => !['delivered', 'rejected', 'expired'].includes(a.status));

  const loadSlots = (oId: string, d: string) => {
    if (oId && d) setSlots(appointmentService.getAvailableSlots(oId, d));
  };

  const handleBook = () => {
    setError('');
    if (!date || !time || !appId) { setError('Completa todos los campos.'); return; }
    const office = OFFICES.find(o => o.id === officeId)!;
    try {
      const apt = appointmentService.book({ userId: user.id, applicationId: appId, officeId, officeName: office.name, date, time, status: 'scheduled' });
      setAppointments(appointmentService.getByUser(user.id));
      setSuccess(`Cita confirmada: ${apt.code} — ${formatDate(apt.date)} a las ${apt.time}`);
      setShowBook(false);
    } catch (e) { setError((e as Error).message); }
  };

  const handleCancel = (id: string) => {
    appointmentService.cancel(id);
    setAppointments(appointmentService.getByUser(user.id));
  };

  const upcoming = appointments.filter(a => a.status === 'scheduled' || a.status === 'rescheduled');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis citas</h1>
          <p className={styles.sub}>Agenda y administra tus citas en las oficinas de la DGM</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowBook(s => !s)}><Plus size={16} /> Agendar cita</button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {showBook && (
        <div className={styles.bookCard}>
          <div className={styles.bookHeader}><h2>Nueva cita</h2><button onClick={() => setShowBook(false)}><X size={18} /></button></div>
          <div className={styles.bookGrid}>
            <div className={styles.field}>
              <label htmlFor="office">Oficina</label>
              <select id="office" value={officeId} onChange={e => { setOfficeId(e.target.value); loadSlots(e.target.value, date); }}>
                {OFFICES.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="apptApp">Trámite asociado</label>
              <select id="apptApp" value={appId} onChange={e => setAppId(e.target.value)}>
                <option value="">Selecciona un trámite</option>
                {userApps.map(a => <option key={a.id} value={a.id}>{a.trackingNumber} — {a.serviceName.slice(0, 40)}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="apptDate">Fecha</label>
              <input id="apptDate" type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => { setDate(e.target.value); loadSlots(officeId, e.target.value); setTime(''); }} />
            </div>
            {slots.length > 0 && (
              <div className={styles.field}>
                <label>Horario disponible</label>
                <div className={styles.slotGrid}>
                  {slots.map(s => (
                    <button key={s} className={`${styles.slot} ${time === s ? styles.slotActive : ''}`} onClick={() => setTime(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {date && slots.length === 0 && <p className={styles.noSlots}>No hay horarios disponibles para esta fecha.</p>}
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <button className={styles.confirmBtn} onClick={handleBook}>Confirmar cita</button>
        </div>
      )}

      <section>
        <h2 className={styles.sectionTitle}>Próximas citas</h2>
        {upcoming.length === 0 ? (
          <EmptyState title="Sin citas próximas" message="No tienes citas programadas." action={{ label: 'Agendar cita', onClick: () => setShowBook(true) }} />
        ) : (
          <div className={styles.list}>
            {upcoming.map(apt => (
              <div key={apt.id} className={styles.aptCard}>
                <div className={styles.aptIcon}><Calendar size={24} /></div>
                <div className={styles.aptInfo}>
                  <span className={styles.aptCode}>{apt.code}</span>
                  <span className={styles.aptOffice}>{apt.officeName}</span>
                  <span className={styles.aptDate}>{formatDate(apt.date)} · {apt.time}</span>
                </div>
                <div className={styles.aptStatus}>
                  <span className={`${styles.aptBadge} ${styles[apt.status]}`}>{apt.status === 'scheduled' ? 'Confirmada' : 'Reprogramada'}</span>
                  <button className={styles.cancelBtn} onClick={() => handleCancel(apt.id)}>Cancelar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Historial</h2>
          <div className={styles.list}>
            {past.map(apt => (
              <div key={apt.id} className={`${styles.aptCard} ${styles.pastCard}`}>
                <div className={styles.aptIcon}><Calendar size={24} /></div>
                <div className={styles.aptInfo}>
                  <span className={styles.aptCode}>{apt.code}</span>
                  <span className={styles.aptOffice}>{apt.officeName}</span>
                  <span className={styles.aptDate}>{formatDate(apt.date)} · {apt.time}</span>
                </div>
                <span className={`${styles.aptBadge} ${styles[apt.status]}`}>{apt.status === 'completed' ? 'Completada' : 'Cancelada'}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
