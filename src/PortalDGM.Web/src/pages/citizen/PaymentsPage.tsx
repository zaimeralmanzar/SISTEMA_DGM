import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService, applicationService } from '../../services';
import type { PaymentOrder } from '../../models';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDateTime } from '../../utils/validation';
import { CreditCard, X } from 'lucide-react';
import styles from './PaymentsPage.module.css';

export function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState(() => user ? paymentService.getByUser(user.id) : []);
  const [paying, setPaying] = useState<PaymentOrder | null>(null);
  const [cardData, setCardData] = useState({ holder: '', number: '', expiry: '', cvv: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handlePay = () => {
    setError('');
    if (!cardData.holder || !cardData.number || !cardData.expiry || !cardData.cvv) { setError('Completa todos los datos del pago.'); return; }
    if (cardData.cvv.length < 3) { setError('CVV inválido.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (!paying) return;
      const updated = paymentService.processPayment(paying.id);
      applicationService.updateStatus(paying.applicationId, 'paid', 'Pago confirmado', 'Sistema');
      setPayments(paymentService.getByUser(user.id));
      setSuccess(`Pago exitoso. Transacción: ${updated.transactionId}`);
      setPaying(null);
      setLoading(false);
    }, 1500);
  };

  const pending = payments.filter(p => p.status === 'pending');
  const paid = payments.filter(p => p.status === 'paid');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pagos</h1>
      {success && <Alert type="success" title="¡Pago realizado!" message={success} onClose={() => setSuccess('')} />}

      {paying && (
        <div className={styles.payModal}>
          <div className={styles.payCard}>
            <div className={styles.payHeader}>
              <h2>Realizar pago</h2>
              <button onClick={() => setPaying(null)}><X size={20} /></button>
            </div>
            <div className={styles.orderInfo}>
              <p><strong>{paying.concept}</strong></p>
              <p className={styles.amount}>{formatCurrency(paying.amount)}</p>
              <p className={styles.disclaimer}>⚠️ Simulación académica — No ingresar datos reales de tarjeta</p>
            </div>
            <div className={styles.payForm}>
              <div className={styles.field}><label htmlFor="holder">Nombre del titular</label><input id="holder" value={cardData.holder} onChange={e => setCardData(p => ({ ...p, holder: e.target.value }))} placeholder="Como aparece en la tarjeta" /></div>
              <div className={styles.field}><label htmlFor="cardNum">Número de tarjeta</label><input id="cardNum" value={cardData.number} onChange={e => setCardData(p => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))} placeholder="0000 0000 0000 0000" maxLength={16} /></div>
              <div className={styles.payRow}>
                <div className={styles.field}><label htmlFor="expiry">Vencimiento</label><input id="expiry" value={cardData.expiry} onChange={e => setCardData(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/AA" maxLength={5} /></div>
                <div className={styles.field}><label htmlFor="cvv">CVV</label><input id="cvv" type="password" value={cardData.cvv} onChange={e => setCardData(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))} placeholder="•••" maxLength={4} /></div>
              </div>
            </div>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            <button className={styles.confirmPayBtn} onClick={handlePay} disabled={loading}>{loading ? 'Procesando...' : `Pagar ${formatCurrency(paying.amount)}`}</button>
          </div>
        </div>
      )}

      <section>
        <h2 className={styles.sectionTitle}>Pagos pendientes</h2>
        {pending.length === 0 ? (
          <EmptyState title="Sin pagos pendientes" message="No tienes órdenes de pago pendientes." />
        ) : (
          <div className={styles.list}>
            {pending.map(p => (
              <div key={p.id} className={styles.payItem}>
                <CreditCard size={20} className={styles.payIcon} />
                <div className={styles.payInfo}>
                  <span className={styles.orderNum}>{p.orderNumber}</span>
                  <span className={styles.concept}>{p.concept}</span>
                  <span className={styles.date}>Creado: {formatDateTime(p.createdAt)}</span>
                </div>
                <div className={styles.payRight}>
                  <span className={styles.payAmount}>{formatCurrency(p.amount)}</span>
                  <button className={styles.payBtn} onClick={() => setPaying(p)}>Pagar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {paid.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Historial de pagos</h2>
          <div className={styles.list}>
            {paid.map(p => (
              <div key={p.id} className={`${styles.payItem} ${styles.paidItem}`}>
                <CreditCard size={20} className={styles.payIconPaid} />
                <div className={styles.payInfo}>
                  <span className={styles.orderNum}>{p.orderNumber}</span>
                  <span className={styles.concept}>{p.concept}</span>
                  {p.paidAt && <span className={styles.date}>Pagado: {formatDateTime(p.paidAt)}</span>}
                  {p.transactionId && <span className={styles.txn}>Txn: {p.transactionId}</span>}
                </div>
                <div className={styles.payRight}>
                  <span className={styles.payAmount}>{formatCurrency(p.amount)}</span>
                  <span className={styles.paidBadge}>✓ Pagado</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
