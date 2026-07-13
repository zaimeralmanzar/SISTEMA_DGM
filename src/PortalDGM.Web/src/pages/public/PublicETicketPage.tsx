import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { Alert } from '../../components/common/Alert';
import styles from './PublicETicketPage.module.css';

export function PublicETicketPage() {
  const [type, setType] = useState<'entry' | 'exit'>('entry');
  const [form, setForm] = useState({ passengerName: '', passport: '', nationality: '', date: '', airline: '', flightNumber: '', port: '', originCountry: '', destinationCountry: '', accommodationAddress: '' });
  const [ticket, setTicket] = useState<{ number: string; code: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = `ET-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    const code = `QR-ET-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setTicket({ number: num, code });
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  if (ticket) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.ticketResult}>
            <div className={styles.ticketHeader}>
              <Ticket size={32} className={styles.ticketIcon} />
              <h1>E-Ticket generado</h1>
            </div>
            <div className={styles.ticketBox}>
              <div className={styles.qrPlaceholder} aria-label="Código QR simulado">
                <div className={styles.qrInner}>QR</div>
                <span>{ticket.code}</span>
              </div>
              <dl className={styles.ticketDetails}>
                <div><dt>Número de E-Ticket</dt><dd><strong>{ticket.number}</strong></dd></div>
                <div><dt>Pasajero</dt><dd>{form.passengerName}</dd></div>
                <div><dt>Pasaporte</dt><dd>{form.passport}</dd></div>
                <div><dt>Tipo</dt><dd>{type === 'entry' ? 'Entrada' : 'Salida'}</dd></div>
                <div><dt>Fecha</dt><dd>{form.date}</dd></div>
                <div><dt>Aerolínea / Vuelo</dt><dd>{form.airline} {form.flightNumber}</dd></div>
              </dl>
            </div>
            <button className={styles.printBtn} onClick={() => window.print()}>Imprimir E-Ticket</button>
            <button className={styles.newBtn} onClick={() => setTicket(null)}>Generar nuevo</button>
            <Alert type="warning" message="Este E-Ticket es una simulación académica y no tiene validez oficial." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <Ticket size={32} className={styles.headerIcon} />
          <h1 className={styles.title}>Formulario E-Ticket</h1>
          <p className={styles.sub}>Formulario electrónico de entrada y salida del país</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.typeToggle}>
            <button className={`${styles.typeBtn} ${type === 'entry' ? styles.typeActive : ''}`} onClick={() => setType('entry')} type="button">Entrada</button>
            <button className={`${styles.typeBtn} ${type === 'exit' ? styles.typeActive : ''}`} onClick={() => setType('exit')} type="button">Salida</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid2}>
              <div className={styles.field}><label htmlFor="passengerName">Nombre completo *</label><input id="passengerName" required value={form.passengerName} onChange={f('passengerName')} /></div>
              <div className={styles.field}><label htmlFor="passport">Número de pasaporte *</label><input id="passport" required value={form.passport} onChange={f('passport')} /></div>
              <div className={styles.field}><label htmlFor="nationality">Nacionalidad *</label><input id="nationality" required value={form.nationality} onChange={f('nationality')} /></div>
              <div className={styles.field}><label htmlFor="date">Fecha de {type === 'entry' ? 'entrada' : 'salida'} *</label><input id="date" type="date" required value={form.date} onChange={f('date')} /></div>
              <div className={styles.field}><label htmlFor="airline">Aerolínea *</label><input id="airline" required value={form.airline} onChange={f('airline')} /></div>
              <div className={styles.field}><label htmlFor="flightNumber">Número de vuelo *</label><input id="flightNumber" required value={form.flightNumber} onChange={f('flightNumber')} /></div>
              <div className={styles.field}><label htmlFor="port">Puerto de entrada/salida *</label><input id="port" required value={form.port} onChange={f('port')} /></div>
              <div className={styles.field}><label htmlFor="originCountry">País de origen *</label><input id="originCountry" required value={form.originCountry} onChange={f('originCountry')} /></div>
              <div className={styles.field}><label htmlFor="destinationCountry">País de destino *</label><input id="destinationCountry" required value={form.destinationCountry} onChange={f('destinationCountry')} /></div>
              {type === 'entry' && <div className={styles.field}><label htmlFor="accommodation">Dirección de alojamiento</label><input id="accommodation" value={form.accommodationAddress} onChange={f('accommodationAddress')} /></div>}
            </div>
            <Alert type="info" message="Verifique que los datos coincidan exactamente con su pasaporte antes de generar el E-Ticket." />
            <button type="submit" className={styles.submitBtn}>Generar E-Ticket</button>
          </form>
        </div>
      </div>
    </div>
  );
}
