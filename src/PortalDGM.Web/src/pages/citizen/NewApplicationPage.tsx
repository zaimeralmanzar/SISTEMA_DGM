import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceCatalogService, applicationService } from '../../services';
import { Stepper } from '../../components/common/Stepper';
import { FormField } from '../../components/forms/FormField';
import { FileUploader } from '../../components/forms/FileUploader';
import { Alert } from '../../components/common/Alert';
import { validatePassportExpiry } from '../../utils/validation';
import type { PersonalData, MigratoryData, ApplicationDocument } from '../../models';
import { OFFICES } from '../../data/offices';
import { formatCurrency } from '../../utils/validation';
import { NotFoundPage } from '../public/NotFoundPage';
import styles from './NewApplicationPage.module.css';

const STEPS = [
  { label: 'Datos personales' },
  { label: 'Info migratoria' },
  { label: 'Documentos' },
  { label: 'Revisión' },
  { label: 'Confirmación' },
];

export function NewApplicationPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = serviceCatalogService.getById(serviceId ?? '');

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{ file: File; valid: boolean }[]>([]);
  const [agree, setAgree] = useState(false);
  const [saved, setSaved] = useState<{ id: string; trackingNumber: string } | null>(null);

  const [personal, setPersonal] = useState<PersonalData>({
    firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', nationality: user?.nationality ?? '',
    passport: user?.documentNumber ?? '', birthDate: user?.birthDate ?? '', maritalStatus: '',
    address: user?.address ?? '', phone: user?.phone ?? '', email: user?.email ?? '',
  });
  const [migratory, setMigratory] = useState<MigratoryData>({
    tramiteType: 'Primera vez', currentCategory: '', entryDate: '', passportExpiry: '',
    residencyExpiry: '', carnetNumber: '', reason: '', preferredOffice: OFFICES[0].id,
  });

  if (!service || !user) return <NotFoundPage />;

  const setP = (k: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setPersonal(p => ({ ...p, [k]: e.target.value }));
  const setM = (k: keyof MigratoryData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setMigratory(m => ({ ...m, [k]: e.target.value }));

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!personal.firstName) errs.firstName = 'Requerido';
    if (!personal.lastName) errs.lastName = 'Requerido';
    if (!personal.passport) errs.passport = 'Requerido';
    if (!personal.nationality) errs.nationality = 'Requerido';
    if (!personal.birthDate) errs.birthDate = 'Requerido';
    if (!personal.maritalStatus) errs.maritalStatus = 'Requerido';
    if (!personal.address) errs.address = 'Requerido';
    if (!personal.phone) errs.phone = 'Requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!migratory.currentCategory) errs.currentCategory = 'Requerido';
    if (!migratory.entryDate) errs.entryDate = 'Requerido';
    if (!migratory.passportExpiry) errs.passportExpiry = 'Requerido';
    else {
      const err = validatePassportExpiry(migratory.passportExpiry);
      if (err) errs.passportExpiry = err;
    }
    if (!migratory.reason) errs.reason = 'Requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    if (files.length === 0) { setErrors({ files: 'Debes adjuntar al menos un documento.' }); return false; }
    if (!files.every(f => f.valid)) { setErrors({ files: 'Corrige los archivos con errores.' }); return false; }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    if (step === 2 && !validateStep3()) return;
    setStep(s => s + 1);
  };

  const submit = (asDraft: boolean) => {
    const docs: ApplicationDocument[] = files.map((f, i) => ({
      id: `doc-new-${i}`, name: f.file.name.replace(/\.[^.]+$/, ''), fileName: f.file.name,
      size: f.file.size, status: 'pending', uploadedAt: new Date().toISOString(),
    }));
    const office = OFFICES.find(o => o.id === migratory.preferredOffice) ?? OFFICES[0];
    const app = applicationService.create({
      serviceId: service.id, serviceName: service.name, userId: user.id,
      status: asDraft ? 'draft' : 'submitted', officeId: office.id, officeName: office.name,
      amount: service.estimatedCost, personalData: personal, migratoryData: migratory,
      documents: docs, analystComment: undefined, nextStep: asDraft ? 'Completar y enviar solicitud' : 'Esperar revisión del analista',
      paymentOrderId: undefined, appointmentId: undefined, issuedDocumentId: undefined,
    });
    setSaved({ id: app.id, trackingNumber: app.trackingNumber });
    setStep(4);
  };

  if (step === 4 && saved) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmation}>
          <div className={styles.confIcon}>✓</div>
          <h1 className={styles.confTitle}>¡Solicitud enviada!</h1>
          <dl className={styles.confDetails}>
            <div><dt>Número de solicitud</dt><dd><strong>{saved.trackingNumber}</strong></dd></div>
            <div><dt>Servicio</dt><dd>{service.name}</dd></div>
            <div><dt>Estado inicial</dt><dd>Enviada — en espera de revisión</dd></div>
            <div><dt>Próximo paso</dt><dd>El analista revisará tu expediente en los próximos días hábiles.</dd></div>
          </dl>
          <div className={styles.confActions}>
            <button className={styles.primaryBtn} onClick={() => navigate(`/portal/tramites/${saved.id}`)}>Ver detalle del trámite</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/portal/tramites')}>Mis trámites</button>
          </div>
          <Alert type="warning" message="Portal académico de demostración — Trámite simulado sin validez oficial." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/servicios')}>← Servicios</button>
        <h1 className={styles.title}>{service.name}</h1>
        <p className={styles.code}>{service.code} · {formatCurrency(service.estimatedCost)}</p>
      </div>
      <Stepper steps={STEPS} current={step} />
      <div className={styles.formCard}>
        {step === 0 && (
          <div className={styles.formGrid}>
            <h2 className={styles.stepTitle}>Datos personales</h2>
            <FormField id="firstName" label="Nombres" required value={personal.firstName} onChange={setP('firstName')} error={errors.firstName} />
            <FormField id="lastName" label="Apellidos" required value={personal.lastName} onChange={setP('lastName')} error={errors.lastName} />
            <FormField id="nationality" label="Nacionalidad" required value={personal.nationality} onChange={setP('nationality')} error={errors.nationality} />
            <FormField id="passport" label="Número de pasaporte" required value={personal.passport} onChange={setP('passport')} error={errors.passport} />
            <FormField id="birthDate" label="Fecha de nacimiento" required type="date" value={personal.birthDate} onChange={setP('birthDate')} error={errors.birthDate} />
            <FormField id="maritalStatus" label="Estado civil" required error={errors.maritalStatus}>
              <select id="maritalStatus" value={personal.maritalStatus} onChange={setP('maritalStatus')}>
                <option value="">Selecciona</option>
                {['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre'].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField id="address" label="Dirección" required value={personal.address} onChange={setP('address')} error={errors.address} />
            <FormField id="phone" label="Teléfono" required type="tel" value={personal.phone} onChange={setP('phone')} error={errors.phone} />
          </div>
        )}
        {step === 1 && (
          <div className={styles.formGrid}>
            <h2 className={styles.stepTitle}>Información migratoria</h2>
            <FormField id="tramiteType" label="Tipo de trámite" error={errors.tramiteType}>
              <select id="tramiteType" value={migratory.tramiteType} onChange={setM('tramiteType')}>
                {['Primera vez', 'Renovación', 'Prórroga', 'Reposición'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField id="currentCategory" label="Categoría migratoria actual" required error={errors.currentCategory}>
              <select id="currentCategory" value={migratory.currentCategory} onChange={setM('currentCategory')}>
                <option value="">Selecciona</option>
                {['Turista', 'Residente Temporal', 'Residente Permanente', 'Otro'].map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField id="entryDate" label="Fecha de entrada al país" required type="date" value={migratory.entryDate} onChange={setM('entryDate')} error={errors.entryDate} />
            <FormField id="passportExpiry" label="Vencimiento del pasaporte" required type="date" value={migratory.passportExpiry} onChange={setM('passportExpiry')} error={errors.passportExpiry} hint="Debe tener mínimo 6 meses de vigencia" />
            <FormField id="residencyExpiry" label="Vencimiento de residencia" type="date" value={migratory.residencyExpiry ?? ''} onChange={setM('residencyExpiry')} />
            <FormField id="carnetNumber" label="Número de carnet (si aplica)" value={migratory.carnetNumber ?? ''} onChange={setM('carnetNumber')} />
            <FormField id="preferredOffice" label="Oficina preferida" error={errors.preferredOffice}>
              <select id="preferredOffice" value={migratory.preferredOffice} onChange={setM('preferredOffice')}>
                {OFFICES.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </FormField>
            <div className={styles.fullWidth}>
              <label htmlFor="reason" className={styles.textareaLabel}>Motivo de la solicitud *</label>
              <textarea id="reason" className={styles.textarea} value={migratory.reason} onChange={setM('reason')} rows={3} required />
              {errors.reason && <span className={styles.errorMsg}>{errors.reason}</span>}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={styles.formGrid}>
            <h2 className={styles.stepTitle}>Documentos</h2>
            <Alert type="info" message="Solo se aceptan archivos JPG o JPEG. Máximo 5MB por archivo. Los documentos serán revisados por el analista." />
            <div className={styles.fullWidth}>
              <FileUploader label="Adjuntar documentos requeridos" onFilesChange={setFiles} />
              {errors.files && <span className={styles.errorMsg}>{errors.files}</span>}
            </div>
            <div className={styles.fullWidth}>
              <h3 className={styles.reqTitle}>Documentos requeridos para este servicio:</h3>
              <ul className={styles.reqList}>{service.documents.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={styles.reviewGrid}>
            <h2 className={styles.stepTitle}>Revisión de la solicitud</h2>
            <section className={styles.reviewSection}>
              <h3>Datos personales</h3>
              <dl className={styles.dl}>
                <div><dt>Nombre</dt><dd>{personal.firstName} {personal.lastName}</dd></div>
                <div><dt>Pasaporte</dt><dd>{personal.passport}</dd></div>
                <div><dt>Nacionalidad</dt><dd>{personal.nationality}</dd></div>
                <div><dt>Teléfono</dt><dd>{personal.phone}</dd></div>
                <div><dt>Dirección</dt><dd>{personal.address}</dd></div>
              </dl>
            </section>
            <section className={styles.reviewSection}>
              <h3>Información migratoria</h3>
              <dl className={styles.dl}>
                <div><dt>Tipo de trámite</dt><dd>{migratory.tramiteType}</dd></div>
                <div><dt>Categoría actual</dt><dd>{migratory.currentCategory}</dd></div>
                <div><dt>Fecha de entrada</dt><dd>{migratory.entryDate}</dd></div>
                <div><dt>Motivo</dt><dd>{migratory.reason}</dd></div>
                <div><dt>Oficina preferida</dt><dd>{OFFICES.find(o => o.id === migratory.preferredOffice)?.name}</dd></div>
              </dl>
            </section>
            <section className={styles.reviewSection}>
              <h3>Documentos adjuntos ({files.length})</h3>
              <ul className={styles.fileList}>{files.map((f, i) => <li key={i}>{f.file.name} · {(f.file.size / 1024).toFixed(0)} KB</li>)}</ul>
            </section>
            <section className={styles.reviewSection}>
              <h3>Servicio y costo</h3>
              <dl className={styles.dl}>
                <div><dt>Servicio</dt><dd>{service.name}</dd></div>
                <div><dt>Costo estimado</dt><dd><strong>{formatCurrency(service.estimatedCost)}</strong></dd></div>
              </dl>
            </section>
            <div className={styles.agreeBox}>
              <label className={styles.agreeLabel}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                Declaro que la información proporcionada es verídica y completa, y acepto que la falsedad de los datos puede resultar en la cancelación del trámite.
              </label>
            </div>
          </div>
        )}

        <div className={styles.navBtns}>
          {step > 0 && step < 4 && <button className={styles.prevBtn} onClick={() => setStep(s => s - 1)}>Anterior</button>}
          <div style={{ flex: 1 }} />
          {step === 3 && <button className={styles.draftBtn} onClick={() => submit(true)}>Guardar borrador</button>}
          {step < 3 && <button className={styles.nextBtn} onClick={handleNext}>Siguiente</button>}
          {step === 3 && <button className={styles.nextBtn} onClick={() => submit(false)} disabled={!agree}>Enviar solicitud</button>}
        </div>
      </div>
    </div>
  );
}
