import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert } from '../../components/common/Alert';
import { Eye, EyeOff } from 'lucide-react';
import styles from './AuthPage.module.css';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    navigate(user.role === 'analyst' ? '/analista' : '/portal', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const u = { email };
      void u;
      navigate(from ?? (email === 'analista@dgm.demo' ? '/analista' : '/portal'), { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'citizen' | 'analyst') => {
    setEmail(role === 'citizen' ? 'ciudadano@dgm.demo' : 'analista@dgm.demo');
    setPassword('Demo1234*');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBox}>
          <span className={styles.logo}>DGM</span>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.sub}>Portal de Servicios Migratorios</p>
        </div>
        <Alert type="warning" message="⚠️ Autenticación de demostración académica — No usar datos reales." />
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} aria-required="true" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.pwdWrapper}>
              <input id="password" type={showPwd ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} aria-required="true" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</button>
        </form>
        <div className={styles.demos}>
          <p className={styles.demosLabel}>Usuarios de demostración:</p>
          <button className={styles.demoBtn} onClick={() => fillDemo('citizen')}>Ciudadano Demo</button>
          <button className={styles.demoBtn} onClick={() => fillDemo('analyst')}>Analista Demo</button>
        </div>
        <p className={styles.register}>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}
