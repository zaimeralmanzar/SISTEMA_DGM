import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Página no encontrada</h2>
      <p className={styles.msg}>La página que buscas no existe o ha sido movida.</p>
      <div className={styles.actions}>
        <button onClick={() => navigate('/')} className={styles.primary}>Ir al inicio</button>
        <button onClick={() => navigate(-1)} className={styles.secondary}>Volver</button>
      </div>
    </div>
  );
}
