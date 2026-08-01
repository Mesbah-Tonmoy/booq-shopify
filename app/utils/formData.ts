export function getString(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  return typeof v === 'string' ? v : null;
}

export function getJSON<T>(fd: FormData, key: string): T | null {
  const v = getString(fd, key);
  return v ? (JSON.parse(v) as T) : null;
}

export function getInt(fd: FormData, key: string): number | null {
  const v = getString(fd, key);
  if (v === null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}
