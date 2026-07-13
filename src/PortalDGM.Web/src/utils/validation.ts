export function validateJpgFile(file: File): string | null {
  const allowedTypes = ['image/jpeg'];
  const allowedExtensions = ['.jpg', '.jpeg'];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(ext)) {
    return 'Solo se permiten archivos JPG o JPEG.';
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) return 'El archivo no debe superar 5MB.';
  return null;
}

export function validatePassportExpiry(expiryDate: string): string | null {
  const expiry = new Date(expiryDate);
  const minValid = new Date();
  minValid.setMonth(minValid.getMonth() + 6);
  if (expiry < minValid) return 'El pasaporte debe tener mínimo 6 meses de vigencia.';
  return null;
}

export function validateAge(birthDate: string, minAge: number): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const adjustedAge = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
  return adjustedAge >= minAge;
}

export function isApplicationExpired(updatedAt: string): boolean {
  const last = new Date(updatedAt);
  const now = new Date();
  const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
}

export function shouldWarnRenewal(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const warn = new Date();
  warn.setDate(warn.getDate() + 45);
  return expiry <= warn;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una letra mayúscula.';
  if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Debe incluir al menos un carácter especial.';
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-DO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
