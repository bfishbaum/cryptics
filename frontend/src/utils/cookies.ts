/**
 * Cookie utilities with GDPR/CCPA compliance
 */

export type CookieConsent = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const CONSENT_COOKIE_NAME = 'cryptics-cookie-consent';
const CONSENT_EXPIRY_DAYS = 365;

/**
 * Get current cookie consent preferences
 */
export function getCookieConsent(): CookieConsent | null {
  try {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
    
    if (!consentCookie) return null;
    
    const consentValue = consentCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(consentValue));
  } catch {
    return null;
  }
}

/**
 * Set cookie consent preferences
 */
export function setCookieConsent(consent: Omit<CookieConsent, 'timestamp'>): void {
  const consentWithTimestamp: CookieConsent = {
    ...consent,
    timestamp: Date.now()
  };
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
  
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consentWithTimestamp))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Check if user has given consent for specific cookie type
 */
export function hasConsentFor(type: keyof Omit<CookieConsent, 'timestamp'>): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent[type];
}

/**
 * Set a functional cookie (only if consent given)
 */
export function setFunctionalCookie(name: string, value: string, days: number = 30): boolean {
  if (!hasConsentFor('functional')) {
    console.warn(`Cannot set functional cookie '${name}' - no consent given`);
    return false;
  }
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  return true;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  const cookieRow = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  
  if (!cookieRow) return null;
  
  try {
    return decodeURIComponent(cookieRow.split('=')[1]);
  } catch {
    return null;
  }
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Delete all non-essential cookies when consent is withdrawn
 */
export function deleteNonEssentialCookies(): void {
  const consent = getCookieConsent();
  if (!consent) return;
  
  // List of functional cookies used by the app
  const functionalCookies = ['cryptics-puzzle-progress'];
  
  if (!consent.functional) {
    functionalCookies.forEach(deleteCookie);
  }
}

/**
 * Check if consent is needed (no consent given or consent expired)
 */
export function needsConsent(): boolean {
  const consent = getCookieConsent();
  if (!consent) return true;
  
  // Check if consent is older than 1 year
  const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
  return consent.timestamp < oneYearAgo;
}