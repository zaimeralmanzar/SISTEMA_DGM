import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>DGM</span>
          <div>
            <p className={styles.name}>Dirección General de Migración</p>
            <p className={styles.sub}>República Dominicana</p>
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.group}>
            <h3>Servicios</h3>
            <Link to="/servicios">Catálogo de servicios</Link>
            <Link to="/eticket">E-Ticket</Link>
            <Link to="/calculadora-estadia">Calculadora</Link>
          </div>
          <div className={styles.group}>
            <h3>Acceso</h3>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
            <Link to="/verificar-documento">Verificar documento</Link>
          </div>
          <div className={styles.group}>
            <h3>Contacto</h3>
            <p>Av. 30 de Mayo, Santo Domingo</p>
            <p>Tel: 809-508-2555</p>
            <p>contacto@migracion.gob.do</p>
          </div>
        </div>
        <div className={styles.disclaimer}>
          <p>⚠️ <strong>Portal académico de demostración.</strong> Los datos, pagos y trámites presentados son simulados y no tienen validez oficial. Este sistema no está afiliado con la DGM real.</p>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} Portal Web DGM — Proyecto académico</p>
      </div>
    </footer>
  );
}
