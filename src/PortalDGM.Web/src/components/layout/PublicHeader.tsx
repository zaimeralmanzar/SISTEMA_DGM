import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './PublicHeader.module.css';

const NAV = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/verificar-documento', label: 'Verificar documento' },
  { to: '/calculadora-estadia', label: 'Calculadora' },
  { to: '/eticket', label: 'E-Ticket' },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>DGM</span>
          <span className={styles.logoText}>Dirección General de Migración</span>
        </Link>
        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`} aria-label="Navegación principal">
          {NAV.map(n => <Link key={n.to} to={n.to} className={styles.link} onClick={() => setOpen(false)}>{n.label}</Link>)}
          <Link to="/login" className={styles.loginLink} onClick={() => setOpen(false)}>Iniciar sesión</Link>
          <Link to="/registro" className={styles.registerLink} onClick={() => setOpen(false)}>Registrarse</Link>
        </nav>
        <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
