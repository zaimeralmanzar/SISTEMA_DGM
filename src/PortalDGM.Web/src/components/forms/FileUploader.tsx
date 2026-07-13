import { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateJpgFile } from '../../utils/validation';
import styles from './FileUploader.module.css';

interface UploadedFile { file: File; error: string | null; preview: string; }

interface Props {
  label: string;
  onFilesChange: (files: { file: File; valid: boolean }[]) => void;
  maxFiles?: number;
}

export function FileUploader({ label, onFilesChange, maxFiles = 10 }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList) => {
    const newFiles: UploadedFile[] = Array.from(incoming).map(file => ({
      file, error: validateJpgFile(file), preview: URL.createObjectURL(file),
    }));
    const updated = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updated);
    onFilesChange(updated.map(f => ({ file: f.file, valid: !f.error })));
  };

  const remove = (idx: number) => {
    URL.revokeObjectURL(files[idx].preview);
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    onFilesChange(updated.map(f => ({ file: f.file, valid: !f.error })));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        role="button" tabIndex={0} aria-label="Área de carga de archivos"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <Upload size={24} className={styles.uploadIcon} aria-hidden="true" />
        <p className={styles.dropText}>Arrastra archivos aquí o <span className={styles.browse}>selecciona</span></p>
        <p className={styles.hint}>Solo JPG/JPEG · Máximo 5MB por archivo</p>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,image/jpeg" multiple className={styles.hidden} onChange={e => e.target.files && handleFiles(e.target.files)} aria-hidden="true" />
      {files.length > 0 && (
        <ul className={styles.list}>
          {files.map((f, idx) => (
            <li key={idx} className={`${styles.item} ${f.error ? styles.invalid : styles.valid}`}>
              <img src={f.preview} alt="" className={styles.preview} aria-hidden="true" />
              <div className={styles.info}>
                <span className={styles.name}>{f.file.name}</span>
                <span className={styles.size}>{(f.file.size / 1024).toFixed(0)} KB</span>
                {f.error ? (
                  <span className={styles.errorMsg}><AlertCircle size={12} aria-hidden="true" /> {f.error}</span>
                ) : (
                  <span className={styles.okMsg}><CheckCircle size={12} aria-hidden="true" /> Listo</span>
                )}
              </div>
              <button className={styles.remove} onClick={() => remove(idx)} aria-label={`Eliminar ${f.file.name}`}><X size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
