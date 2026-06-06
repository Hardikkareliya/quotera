/** 15-character Indian GSTIN (after normalizing). */
export const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function normalizeGstin(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidGstin(value: string): boolean {
  const normalized = normalizeGstin(value);
  return !normalized || GSTIN_REGEX.test(normalized);
}
