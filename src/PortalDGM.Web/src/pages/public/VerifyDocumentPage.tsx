import { useState } from 'react';
import { documentVerificationService } from '../../services';
import type { IssuedDocument } from '../../models';
import { Alert } from '../../components/common/Alert';
import { formatDate } from '../../utils/validation';
import { Search, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import styles from './VerifyDocumentPage.module.css';

export function VerifyDocumentPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<IssuedDocument | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(documentVerificationService.verify(query));
      setLoading(false);
    }, 600);
  };

  const statusInfo = result ? {
    valid: { icon: CheckCircle, label: 'Documento válido', color: 'var(--color-success)' },
    expired: { icon: AlertTriangle, label: 'Documento vencido', color: 'var(--color-warning)' },
    revoked: { icon: XCircle, label: 'Documento revocado', color: 'var(--color-error)' },
  }[result.status] : null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <Shield size={32} className={styles.headerIcon} />
          <h1 className={styles.title}>Verificación de documentos</h1>
          <p className={styles.sub}>Consulta el estado de un documento migratorio emitido por la DGM</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <form className={styles.form} onSubmit={handleSearch}>
            <label htmlFor="doc-query" className={styles.label}>Número de documento, carnet o código de verificación</label>
            <div className={styles.inputRow}>
              <input
                id="doc-query"
                type="text"
                className={styles.input}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ej: RT-2025-001847 o DGM-VER-8472-XKPL"
                aria-required="true"
              />
              <button type="submit" className={styles.searchBtn} disabled={loading}>
                <Search size={18} /> {loading ? 'Buscando...' : 'Verificar'}
              </button>
            </div>
          </form>
          <Alert type="info" message="Esta consulta es de carácter público. Los datos son simulados con fines académicos." />
        </div>

        {result === null && (
          <div className={styles.resultBox}>
            <Alert type="error" title="Documento no encontrado" message="El código o número ingresado no corresponde a ningún documento registrado." />
          </div>
        )}

        {result && statusInfo && (
          <div className={styles.resultBox}>
            <div className={styles.resultCard}>
              <div className={styles.resultHeader} style={{ borderLeftColor: statusInfo.color }}>
                <statusInfo.icon size={28} style={{ color: statusInfo.color }} aria-hidden="true" />
                <div>
                  <h2 className={styles.resultStatus} style={{ color: statusInfo.color }}>{statusInfo.label}</h2>
                  <p className={styles.resultType}>{result.type}</p>
                </div>
              </div>
              <dl className={styles.dl}>
                <div className={styles.dlRow}><dt>Titular</dt><dd>{result.holderName}</dd></div>
                <div className={styles.dlRow}><dt>Número de documento</dt><dd>{result.documentNumber}</dd></div>
                {result.carnetNumber && <div className={styles.dlRow}><dt>Número de carnet</dt><dd>{result.carnetNumber}</dd></div>}
                <div className={styles.dlRow}><dt>Fecha de emisión</dt><dd>{formatDate(result.issuedAt)}</dd></div>
                <div className={styles.dlRow}><dt>Fecha de vencimiento</dt><dd>{formatDate(result.expiresAt)}</dd></div>
                <div className={styles.dlRow}><dt>Código de verificación</dt><dd><code>{result.verificationCode}</code></dd></div>
              </dl>
              <p className={styles.disclaimer}>⚠️ Datos simulados — Portal académico de demostración</p>
            </div>
          </div>
        )}

        <div className={styles.examples}>
          <h3>Códigos de prueba</h3>
          <div className={styles.exampleList}>
            <button onClick={() => setQuery('DGM-VER-8472-XKPL')} className={styles.exampleBtn}>DGM-VER-8472-XKPL (Válido)</button>
            <button onClick={() => setQuery('DGM-VER-0234-ABCD')} className={styles.exampleBtn}>DGM-VER-0234-ABCD (Vencido)</button>
            <button onClick={() => setQuery('DGM-VER-0099-REVO')} className={styles.exampleBtn}>DGM-VER-0099-REVO (Revocado)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
