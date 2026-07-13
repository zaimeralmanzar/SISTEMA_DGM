import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { Footer } from '../components/layout/Footer';
import styles from './PublicLayout.module.css';

export function PublicLayout() {
  return (
    <div className={styles.wrapper}>
      <PublicHeader />
      <main className={styles.main} id="main-content"><Outlet /></main>
      <Footer />
    </div>
  );
}
