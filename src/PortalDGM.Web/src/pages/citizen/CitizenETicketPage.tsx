import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { eticketService } from '../../services';
import type { ETicket } from '../../models';
import { Alert } from '../../components/common/Alert';
import { Ticket, Plus } from 'lucide-react';
import { formatDate } from '../../utils/validation';
import styles from './CitizenETicketPage.module.css';

export function CitizenETicketPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<ETicket[]>(() => user ? eticketService.getByUser(user.id) : []);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'entry' | 'exit'>('entry');
  const [form, setForm] = useState({ passengerName: user ? user.firstName + ' ' + user.lastName : '', passport: user?.documentNumber ?? '', nationality: user?.nationality ?? '', date: '', airline: '', flightNumber: '', port: '', originCountry: '', destinationCountry: '', accommodationAddress: '' });
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = eticketService.create({ ...form, type, userId: user.id });
    setTickets(eticketService.getByUser(user.id));
    setSuccess(`E-Ticket ${ticket.ticketNumber} generado exitosamente.`);
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1 className={styles.title}>E-Ticket</h1><p className={styles.sub}>Formularios electrónicos de entrada y salida</p></div>
        <button className={styles.newBtn} onClick={() => setShowForm(s => !s)}><Plus size={16} /> Nuevo E-Ticket</button>
      </div>
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Nuevo E-Ticket</h2>
          <div className={styles.typeToggle}>
            <button className={`${styles.typeBtn} ${type === 'entry' ? styles.typeActive : ''}`} onClick={() => setType('entry')} type="button">Entrada</button>
            <button className={`${styles.typeBtn} ${type === 'exit' ? styles.typeActive : ''}`} onClick={() => setType('exit')} type="button">Salida</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid2}>
              <div className={styles.field}><label htmlFor="pName">Nombre completo *</label><input id="pName" required value={form.passengerName} onChange={f('passengerName')} /></div>
              <div className={styles.field}><label htmlFor="pPass">Pasaporte *</label><input id="pPass" required value={form.passport} onChange={f('passport')} /></div>
              <div className={styles.field}><label htmlFor="pNat">Nacionalidad *</label><input id="pNat" required value={form.nationality} onChange={f('nationality')} /></div>
              <div className={styles.field}><label htmlFor="pDate">Fecha *</label><input id="pDate" type="date" required value={form.date} onChange={f('date')} /></div>
              <div className={styles.field}><label htmlFor="pAirline">Aerolínea *</label><input id="pAirline" required value={form.airline} onChange={f('airline')} /></div>
              <div className={styles.field}><label htmlFor="pFlight">Vuelo *</label><input id="pFlight" required value={form.flightNumber} onChange={f('flightNumber')} /></div>
              <div className={styles.field}><label htmlFor="pPort">Puerto *</label><input id="pPort" required value={form.port} onChange={f('port')} /></div>
              <div className={styles.field}><label htmlFor="pOrigin">País de origen *</label><input id="pOrigin" required value={form.originCountry} onChange={f('originCountry')} /></div>
              <div className={styles.field}><label htmlFor="pDest">País de destino *</label><input id="pDest" required value={form.destinationCountry} onChange={f('destinationCountry')} /></div>
              {type === 'entry' && <div className={styles.field}><label htmlFor="pAccomm">Alojamiento</label><input id="pAccomm" value={form.accommodationAddress} onChange={f('accommodationAddress')} /></div>}
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>Generar E-Ticket</button>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <section>
        <h2 className={styles.sectionTitle}>Mis E-Tickets</h2>
        {tickets.length === 0 ? (
          <div className={styles.empty}><Ticket size={40} /><p>No has generado E-Tickets aún.</p></div>
        ) : (
          <div className={styles.list}>
            {tickets.map(t => (
              <div key={t.id} className={styles.ticketCard}>
                <div className={styles.ticketLeft}>
                  <Ticket size={20} className={styles.ticketIcon} />
                  <div>
                    <p className={styles.ticketNum}>{t.ticketNumber}</p>
                    <p className={styles.ticketType}>{t.type === 'entry' ? 'Entrada' : 'Salida'} · {t.airline} {t.flightNumber}</p>
                    <p className={styles.ticketDate}>{formatDate(t.date)} · {t.port}</p>
                  </div>
                </div>
                <div className={styles.ticketRight}>
                  <code className={styles.verCode}>{t.verificationCode}</code>
                  <button className={styles.printBtn} onClick={() => window.print()}>Imprimir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Alert type="info" message="Los E-Tickets son una simulación académica y no tienen validez oficial." />
    </div>
  );
}
