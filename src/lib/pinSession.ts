/**
 * PIN Verification Session Management
 * 
 * Uses sessionStorage to track PIN verification status.
 * SessionStorage persists data only for the current browser tab session.
 * Data is cleared when:
 * - User closes the tab/window
 * - User logs out (if we clear it manually)
 * - Browser is closed (in some browsers)
 */

const PIN_VERIFIED_KEY = 'pin_verified';

export const pinSessionUtils = {
    /**
     * Check if PIN has been verified in this session
     */
    isVerified: (): boolean => {
        if (typeof window === 'undefined') return false;
        return sessionStorage.getItem(PIN_VERIFIED_KEY) === 'true';
    },

    /**
     * Mark PIN as verified for this session
     */
    setVerified: (): void => {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(PIN_VERIFIED_KEY, 'true');
    },

    /**
     * Clear PIN verification (e.g., on logout)
     */
    clearVerification: (): void => {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(PIN_VERIFIED_KEY);
    },
};
