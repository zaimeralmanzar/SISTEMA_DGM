import { useState } from 'react';
import { overstayService } from '../../services';
import type { OverstayResult } from '../../models';
import { Alert } from '../../components/common/Alert';
import { formatCurrency } from '../../utils/validation';
import { Calculator } from 'lucide-react';
import styles from './OverstayCalculatorPage.module.css';

export function OverstayCalculatorPage() {
  const [form, setForm] = useState({ entryDate: '', plannedExit: '', authorizedDays: '30' });
  const [result, setResult] = useState<OverstayResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.entryDate || !form.plannedExit || !form.authorizedDays) { setError('Completa todos los campos.'); return; }
    const entry = new Date(form.entryDate);
    const exit = new Date(form.plannedExit);
    if (exit <= entry) { setError('La fecha de salida debe ser posterior a la de entrada.'); return; }
    const calc = overstayService.calculate(form.entryDate, form.plannedExit, parseInt(form.authorizedDays));
    setResult(calc);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <Calculator size={32} className={styles.headerIcon} />
          <h1 className={styles.title}>Calculadora de sobreestadía</h1>
          <p className={styles.sub}>Estima los días de exceso y la tasa correspondiente</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="entryDate">Fecha de entrada al país</label>
              <input id="entryDate" type="date" value={form.entryDate} onChange={e => setForm(f => ({ ...f, entryDate: e.target.value }))} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="plannedExit">Fecha prevista de salida</label>
              <input id="plannedExit" type="date" value={form.plannedExit} onChange={e => setForm(f => ({ ...f, plannedExit: e.target.value }))} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="authorizedDays">Días autorizados de estadía</label>
              <input id="authorizedDays" type="number" min="1" max="365" value={form.authorizedDays} onChange={e => setForm(f => ({ ...f, authorizedDays: e.target.value }))} required />
            </div>
            {error && <Alert type="error" message={error} />}
            <button type="submit" className={styles.calcBtn}>Calcular</button>
          </form>
        </div>

        {result && (
          <div className={styles.result}>
            <div className={styles.resultGrid}>
              <div className={styles.statBox}><span className={styles.statLabel}>Días transcurridos</span><span className={styles.statValue}>{result.elapsedDays}</span></div>
              <div className={styles.statBox}><span className={styles.statLabel}>Días autorizados</span><span className={styles.statValue}>{result.authorizedDays}</span></div>
              <div className={`${styles.statBox} ${result.isOverstay ? styles.statError : styles.statOk}`}>
                <span className={styles.statLabel}>Días excedidos</span>
                <span className={styles.statValue}>{result.exceededDays}</span>
              </div>
              <div className={`${styles.statBox} ${result.isOverstay ? styles.statError : styles.statOk}`}>
                <span className={styles.statLabel}>Tasa estimada</span>
                <span className={styles.statValue}>{formatCurrency(result.estimatedFee)}</span>
              </div>
            </div>
            {result.breakdown.length > 0 && (
              <div className={styles.breakdown}>
                <h3>Desglose</h3>
                {result.breakdown.map((b, i) => (
                  <div key={i} className={styles.breakdownRow}><span>{b.concept}</span><strong>{formatCurrency(b.amount)}</strong></div>
                ))}
              </div>
            )}
            <Alert type={result.isOverstay ? 'warning' : 'success'}
              message={result.isOverstay
                ? `Presenta sobreestadía de ${result.exceededDays} día(s). Regularice su situación a la brevedad. Esta es una estimación informativa — el monto oficial se determina en la DGM.`
                : 'No presenta sobreestadía. Está dentro del período autorizado.'
              }
            />
          </div>
        )}

        <Alert type="info" message="Esta calculadora es de carácter informativo y académico. Los cálculos definitivos corresponden a la Dirección General de Migración." />
      </div>
    </div>
  );
}
