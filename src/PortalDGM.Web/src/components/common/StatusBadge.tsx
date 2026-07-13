import type { ApplicationStatus } from '../../models';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/statusLabels';

interface Props { status: ApplicationStatus; }

export function StatusBadge({ status }: Props) {
  const label = STATUS_LABELS[status];
  const color = STATUS_COLORS[status];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em',
      backgroundColor: color + '1a', color, border: `1px solid ${color}40`,
    }}>
      {label}
    </span>
  );
}
