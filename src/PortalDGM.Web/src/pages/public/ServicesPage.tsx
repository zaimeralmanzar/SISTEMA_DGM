import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceCatalogService } from '../../services';
import { SearchInput } from '../../components/common/SearchInput';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/validation';
import styles from './ServicesPage.module.css';

export function ServicesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const categories = serviceCatalogService.getCategories();
  const services = serviceCatalogService.search(query, category || undefined);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Catálogo de servicios</h1>
          <p className={styles.sub}>Encuentra el trámite migratorio que necesitas</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.filters}>
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar servicio..." />
          <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {services.length === 0 ? (
          <EmptyState title="Sin resultados" message="No se encontraron servicios con los filtros aplicados." action={{ label: 'Limpiar filtros', onClick: () => { setQuery(''); setCategory(''); } }} />
        ) : (
          <div className={styles.grid}>
            {services.map(service => (
              <div key={service.id} className={styles.card} onClick={() => navigate(`/servicios/${service.id}`)}>
                <div className={styles.cardTop}>
                  <span className={styles.code}>{service.code}</span>
                  <span className={styles.cat}>{service.category}</span>
                </div>
                <h2 className={styles.name}>{service.name}</h2>
                <p className={styles.desc}>{service.description}</p>
                <div className={styles.meta}>
                  <div className={styles.metaItem}><strong>Costo:</strong> {service.estimatedCost > 0 ? formatCurrency(service.estimatedCost) : 'Gratuito'}</div>
                  <div className={styles.metaItem}><strong>Plazo:</strong> {service.responseTime}</div>
                  <div className={styles.metaItem}><strong>Modalidad:</strong> {service.modality}</div>
                </div>
                <button className={styles.detailBtn}>Ver detalles</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
