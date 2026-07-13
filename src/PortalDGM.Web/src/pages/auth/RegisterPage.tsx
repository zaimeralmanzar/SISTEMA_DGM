import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type RegisterData } from '../../contexts/AuthContext';
import { Alert } from '../../components/common/Alert';
import { validatePassword, validateAge } from '../../utils/validation';
import { Eye, EyeOff } from 'lucide-react';
import styles from './AuthPage.module.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState<RegisterData & { confirmPassword: string }>({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    documentType: 'passport', documentNumber: '', nationality: '', birthDate: '',
    phone: '', address: '', secondaryEmail: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const pwdErr = validatePassword(form.password);
    if (pwdErr) { setError(pwdErr); return; }
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    if (form.birthDate && !validateAge(form.birthDate, 18)) { setError('Debes ser mayor de 18 años para registrarte.'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/portal');
    } catch (err) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.wide}`}>
        <div className={styles.logoBox}>
          <span className={styles.logo}>DGM</span>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.sub}>Portal de Servicios Migratorios</p>
        </div>
        <Alert type="warning" message="⚠️ Registro de demostración académica — No usar datos reales." />
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid2}>
            <div className={styles.field}><label htmlFor="firstName">Nombres *</label><input id="firstName" required value={form.firstName} onChange={set('firstName')} /></div>
            <div className={styles.field}><label htmlFor="lastName">Apellidos *</label><input id="lastName" required value={form.lastName} onChange={set('lastName')} /></div>
            <div className={styles.field}><label htmlFor="regEmail">Correo electrónico *</label><input id="regEmail" type="email" required value={form.email} onChange={set('email')} /></div>
            <div className={styles.field}><label htmlFor="phone">Teléfono *</label><input id="phone" type="tel" required value={form.phone} onChange={set('phone')} /></div>
            <div className={styles.field}>
              <label htmlFor="docType">Tipo de documento *</label>
              <select id="docType" required value={form.documentType} onChange={set('documentType')}>
                <option value="passport">Pasaporte</option>
                <option value="cedula">Cédula</option>
              </select>
            </div>
            <div className={styles.field}><label htmlFor="docNumber">Número de documento *</label><input id="docNumber" required value={form.documentNumber} onChange={set('documentNumber')} /></div>
            <div className={styles.field}><label htmlFor="nationality">Nacionalidad *</label><input id="nationality" required value={form.nationality} onChange={set('nationality')} /></div>
            <div className={styles.field}><label htmlFor="birthDate">Fecha de nacimiento *</label><input id="birthDate" type="date" required value={form.birthDate} onChange={set('birthDate')} /></div>
          </div>
          <div className={styles.field}><label htmlFor="address">Dirección *</label><input id="address" required value={form.address} onChange={set('address')} /></div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label htmlFor="regPwd">Contraseña *</label>
              <div className={styles.pwdWrapper}>
                <input id="regPwd" type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')} />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)} aria-label="Mostrar/ocultar contraseña">{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <small>Mínimo 8 chars, mayúscula, número y carácter especial</small>
            </div>
            <div className={styles.field}><label htmlFor="confirmPwd">Confirmar contraseña *</label><input id="confirmPwd" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} /></div>
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <p className={styles.register}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
