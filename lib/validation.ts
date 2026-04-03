/**
 * Shared validation utilities for onboarding forms.
 *
 * A "valid string" must contain at least 2 alphabetic characters
 * and must not be only punctuation / whitespace (e.g. ".", "-", "...").
 */

/** Returns true when the value looks like a meaningful string (not just dots / dashes / spaces). */
export function isValidString(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;

  // Must contain at least 2 letter characters (any script)
  const letterCount = (trimmed.match(/\p{L}/gu) || []).length;
  if (letterCount < 2) return false;

  // Reject if composed entirely of punctuation / symbols / whitespace
  if (/^[\s\p{P}\p{S}]+$/u.test(trimmed)) return false;

  return true;
}

/** Returns true when the value is a valid email address. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Returns true when the value contains only digits and is 10 digits long (Indian mobile). */
export function isValidPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}
