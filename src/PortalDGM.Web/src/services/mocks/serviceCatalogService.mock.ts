import type { Service } from '../../models';
import { SERVICES } from '../../data';

export const serviceCatalogServiceMock = {
  getAll(): Service[] { return SERVICES; },
  getById(id: string): Service | null { return SERVICES.find(s => s.id === id) ?? null; },
  search(query: string, category?: string): Service[] {
    const q = query.toLowerCase();
    return SERVICES.filter(s => {
      const matchQuery = !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      const matchCategory = !category || s.category === category;
      return matchQuery && matchCategory;
    });
  },
  getCategories(): string[] { return [...new Set(SERVICES.map(s => s.category))]; },
};
