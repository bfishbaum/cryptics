import React, { useState, useEffect } from 'react';
import { getCookieConsent, setCookieConsent, needsConsent, deleteNonEssentialCookies } from '../utils/cookies';

interface CookieConsentProps {
  onConsentChange?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    if (needsConsent()) {
      setShowBanner(true);
      // Load existing preferences if any
      const existing = getCookieConsent();
      if (existing) {
        setPreferences({
          essential: true,
          functional: existing.functional,
          analytics: existing.analytics,
          marketing: existing.marketing
        });
      }
    }
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    setShowBanner(false);
    onConsentChange?.();
  };

  const handleRejectAll = () => {
    setCookieConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    deleteNonEssentialCookies();
    setShowBanner(false);
    onConsentChange?.();
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    if (!preferences.functional) {
      deleteNonEssentialCookies();
    }
    setShowBanner(false);
    onConsentChange?.();
  };

  const handlePreferenceChange = (type: keyof typeof preferences, value: boolean) => {
    if (type === 'essential') return; // Cannot change essential cookies
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-consent-content">
          <h3>Cookie Preferences</h3>
          
          {!showDetails ? (
            <>
              <p>
                We use cookies to enhance your experience on our cryptogram puzzle site. 
                Essential cookies are required for the site to function, while functional 
                cookies help save your puzzle progress.
              </p>
              
              <div className="cookie-consent-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={handleAcceptAll}
                >
                  Accept All
                </button>
                <button 
                  className="btn" 
                  onClick={handleRejectAll}
                >
                  Reject All
                </button>
                <button 
                  className="btn cookie-settings-btn" 
                  onClick={() => setShowDetails(true)}
                >
                  Cookie Settings
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Choose which cookies you'd like to allow:</p>
              
              <div className="cookie-preferences">
                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={preferences.essential}
                        disabled={true}
                        readOnly
                      />
                      <span className="cookie-category-title">Essential Cookies</span>
                      <span className="required-badge">Required</span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Necessary for the website to function properly. Cannot be disabled.
                  </p>
                </div>

                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={preferences.functional}
                        onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                      />
                      <span className="cookie-category-title">Functional Cookies</span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Save your puzzle progress and preferences for a better experience.
                  </p>
                </div>

                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                      />
                      <span className="cookie-category-title">Analytics Cookies</span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Help us understand how visitors use our site to improve performance.
                  </p>
                </div>

                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                      />
                      <span className="cookie-category-title">Marketing Cookies</span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Used to deliver personalized content and advertisements.
                  </p>
                </div>
              </div>
              
              <div className="cookie-consent-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </button>
                <button 
                  className="btn" 
                  onClick={() => setShowDetails(false)}
                >
                  Back
                </button>
              </div>
            </>
          )}
          
          <p className="cookie-consent-footer">
            You can change your preferences at any time in our{' '}
            <a href="/privacy" className="cookie-consent-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};