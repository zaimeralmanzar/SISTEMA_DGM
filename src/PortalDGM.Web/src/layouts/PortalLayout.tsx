import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { NotificationProvider } from '../contexts/NotificationContext';
import styles from './PortalLayout.module.css';

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className={styles.wrapper}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={styles.content}>
          <AppHeader onMenuToggle={() => setSidebarOpen(o => !o)} />
          <main className={styles.main} id="main-content"><Outlet /></main>
        </div>
      </div>
    </NotificationProvider>
  );
}
