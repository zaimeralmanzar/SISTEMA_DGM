import type { TimelineEvent } from '../../models';
import { STATUS_LABELS } from '../../utils/statusLabels';
import { formatDateTime } from '../../utils/validation';
import styles from './Timeline.module.css';

interface Props { events: TimelineEvent[]; }

export function Timeline({ events }: Props) {
  return (
    <ol className={styles.timeline} aria-label="Historial de la solicitud">
      {[...events].reverse().map(ev => (
        <li key={ev.id} className={styles.event}>
          <div className={styles.dot} aria-hidden="true" />
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.status}>{STATUS_LABELS[ev.status]}</span>
              <span className={styles.date}>{formatDateTime(ev.date)}</span>
            </div>
            {ev.comment && <p className={styles.comment}>{ev.comment}</p>}
            <p className={styles.actor}>Por: {ev.actor}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
