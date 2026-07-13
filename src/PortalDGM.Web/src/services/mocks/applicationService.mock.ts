import type { Application, ApplicationStatus, ApplicationDocument } from '../../models';
import { MOCK_APPLICATIONS } from '../../data';
import { storageAdapter } from './storageAdapter';

const KEY = 'applications';

function getAll(): Application[] {
  return storageAdapter.get<Application[]>(KEY) ?? MOCK_APPLICATIONS;
}

function saveAll(apps: Application[]): void {
  storageAdapter.set(KEY, apps);
}

export const applicationServiceMock = {
  getByUser(userId: string): Application[] {
    return getAll().filter(a => a.userId === userId);
  },

  getAll(): Application[] {
    return getAll();
  },

  getById(id: string): Application | null {
    return getAll().find(a => a.id === id) ?? null;
  },

  create(data: Omit<Application, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Application {
    const apps = getAll();
    const num = String(apps.length + 1).padStart(6, '0');
    const trackingNumber = `DGM-${new Date().getFullYear()}-${num}`;
    const now = new Date().toISOString();
    const app: Application = {
      ...data,
      id: `app-${Date.now()}`,
      trackingNumber,
      createdAt: now,
      updatedAt: now,
      timeline: [{ id: `tl-${Date.now()}`, date: now, status: data.status, actor: 'Sistema', comment: data.status === 'draft' ? 'Borrador guardado' : 'Solicitud enviada' }],
    };
    saveAll([...apps, app]);
    return app;
  },

  updateStatus(id: string, status: ApplicationStatus, comment: string, actor: string): Application {
    const apps = getAll();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Solicitud no encontrada.');
    const now = new Date().toISOString();
    apps[idx] = {
      ...apps[idx],
      status,
      updatedAt: now,
      analystComment: comment,
      timeline: [...apps[idx].timeline, { id: `tl-${Date.now()}`, date: now, status, actor, comment }],
    };
    saveAll(apps);
    return apps[idx];
  },

  addDocument(id: string, doc: ApplicationDocument): Application {
    const apps = getAll();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Solicitud no encontrada.');
    apps[idx] = { ...apps[idx], documents: [...apps[idx].documents, doc], updatedAt: new Date().toISOString() };
    saveAll(apps);
    return apps[idx];
  },

  removeDocument(appId: string, docId: string): Application {
    const apps = getAll();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) throw new Error('Solicitud no encontrada.');
    apps[idx] = { ...apps[idx], documents: apps[idx].documents.filter(d => d.id !== docId), updatedAt: new Date().toISOString() };
    saveAll(apps);
    return apps[idx];
  },
};
