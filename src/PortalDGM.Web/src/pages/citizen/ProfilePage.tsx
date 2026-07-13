import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_ACCESS_LOGS } from '../../data';
import { Alert } from '../../components/common/Alert';
import { FormField } from '../../components/forms/FormField';
import { validatePassword } from '../../utils/validation';
import { formatDate, formatDateTime } from '../../utils/validation';
import { User, Lock, History } from 'lucide-react';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [secondaryEmail, setSecondaryEmail] = useState(user?.secondaryEmail ?? '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  if (!user) return null;

  const handleSaveProfile = async () => {
    setProfileError('');
    try {
      await updateProfile({ phone, address, secondaryEmail: secondaryEmail || undefined });
      setProfileSuccess('Perfil actualizado correctamente.');
      setEditMode(false);
    } catch (e) { setProfileError((e as Error).message); }
  };

  const handleChangePwd = async () => {
    setPwdError('');
    const err = validatePassword(newPwd);
    if (err) { setPwdError(err); return; }
    if (newPwd !== confirmPwd) { setPwdError('Las contraseñas no coinciden.'); return; }
    try {
      await changePassword(currentPwd, newPwd);
      setPwdSuccess('Contraseña actualizada correctamente.');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (e) { setPwdError((e as Error).message); }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi perfil</h1>

      {/* Personal info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}><User size={18} /> Información personal</div>
          {!editMode && <button className={styles.editBtn} onClick={() => setEditMode(true)}>Editar</button>}
        </div>
        {profileSuccess && <Alert type="success" message={profileSuccess} onClose={() => setProfileSuccess('')} />}
        {profileError && <Alert type="error" message={profileError} onClose={() => setProfileError('')} />}
        <dl className={styles.dl}>
          <div><dt>Nombre completo</dt><dd>{user.firstName} {user.lastName}</dd></div>
          <div><dt>Correo principal</dt><dd>{user.email}</dd></div>
          <div><dt>Tipo de documento</dt><dd>{user.documentType === 'passport' ? 'Pasaporte' : 'Cédula'}</dd></div>
          <div><dt>Número de documento</dt><dd>{user.documentNumber}</dd></div>
          <div><dt>Nacionalidad</dt><dd>{user.nationality}</dd></div>
          <div><dt>Fecha de nacimiento</dt><dd>{formatDate(user.birthDate)}</dd></div>
        </dl>
        {editMode ? (
          <div className={styles.editGrid}>
            <FormField id="phone" label="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} />
            <FormField id="address" label="Dirección" value={address} onChange={e => setAddress(e.target.value)} />
            <FormField id="secondaryEmail" label="Correo secundario" type="email" value={secondaryEmail} onChange={e => setSecondaryEmail(e.target.value)} />
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSaveProfile}>Guardar cambios</button>
              <button className={styles.cancelBtn} onClick={() => setEditMode(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <dl className={styles.dl}>
            <div><dt>Teléfono</dt><dd>{user.phone}</dd></div>
            <div><dt>Dirección</dt><dd>{user.address}</dd></div>
            <div><dt>Correo secundario</dt><dd>{user.secondaryEmail ?? '—'}</dd></div>
          </dl>
        )}
      </div>

      {/* Change password */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><Lock size={18} /> Cambiar contraseña</div>
        {pwdSuccess && <Alert type="success" message={pwdSuccess} onClose={() => setPwdSuccess('')} />}
        {pwdError && <Alert type="error" message={pwdError} onClose={() => setPwdError('')} />}
        <div className={styles.editGrid}>
          <FormField id="currentPwd" label="Contraseña actual" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
          <FormField id="newPwd" label="Nueva contraseña" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} hint="Mínimo 8 chars, mayúscula, número, carácter especial" />
          <FormField id="confirmPwd" label="Confirmar nueva contraseña" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
          <button className={styles.saveBtn} onClick={handleChangePwd}>Cambiar contraseña</button>
        </div>
        <Alert type="info" message="La autenticación es una simulación académica — no usar contraseñas reales." />
      </div>

      {/* Access history */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><History size={18} /> Historial de acceso</div>
        <div className={styles.logList}>
          {MOCK_ACCESS_LOGS.map(log => (
            <div key={log.id} className={styles.logItem}>
              <div><p className={styles.logAction}>{log.action}</p><p className={styles.logMeta}>{log.device} · {log.ip}</p></div>
              <p className={styles.logDate}>{formatDateTime(log.date)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
