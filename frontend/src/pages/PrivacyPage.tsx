import React, { useState } from 'react';
import { getCookieConsent, setCookieConsent, deleteNonEssentialCookies } from '../utils/cookies';
import { clearAllPuzzleProgress } from '../utils/puzzleProgress';

export const PrivacyPage: React.FC = () => {
  const [currentConsent, setCurrentConsent] = useState(getCookieConsent());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleConsentChange = (type: 'functional' | 'analytics' | 'marketing', value: boolean) => {
    if (!currentConsent) return;

    const newConsent = { ...currentConsent, [type]: value };
    setCookieConsent(newConsent);
    setCurrentConsent(newConsent);

    // If functional cookies disabled, clear puzzle progress
    if (type === 'functional' && !value) {
      deleteNonEssentialCookies();
      clearAllPuzzleProgress();
    }

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your saved puzzle progress? This cannot be undone.')) {
      clearAllPuzzleProgress();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Privacy Policy</h1>
        
        {showSuccessMessage && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '15px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            Settings updated successfully!
          </div>
        )}

        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Our Commitment to Privacy</h2>
            <p style={{ marginBottom: '15px' }}>
              At Cryptic Clues, we respect your privacy and are committed to protecting your personal data. 
              This policy explains how we collect, use, and protect information when you visit our cryptogram puzzle website.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Information We Collect</h2>
            <p style={{ marginBottom: '15px' }}>
              We collect minimal information to provide our service:
            </p>
            <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
              <li>Puzzle progress and solutions (stored locally with your consent)</li>
              <li>Basic usage statistics (if you consent to analytics cookies)</li>
              <li>Technical information necessary for the website to function</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>How We Use Cookies</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Essential Cookies (Always Active)</h3>
              <p style={{ marginBottom: '10px' }}>
                Required for the website to function properly. These cannot be disabled.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Functional Cookies</h3>
              <p style={{ marginBottom: '10px' }}>
                Save your puzzle progress and preferences for a better experience.
              </p>
              {currentConsent && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.functional}
                    onChange={(e) => handleConsentChange('functional', e.target.checked)}
                  />
                  <span>Allow functional cookies</span>
                </label>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Analytics Cookies</h3>
              <p style={{ marginBottom: '10px' }}>
                Help us understand how visitors use our site to improve performance.
              </p>
              {currentConsent && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.analytics}
                    onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                  />
                  <span>Allow analytics cookies</span>
                </label>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Marketing Cookies</h3>
              <p style={{ marginBottom: '10px' }}>
                Used to deliver personalized content and advertisements.
              </p>
              {currentConsent && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.marketing}
                    onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                  />
                  <span>Allow marketing cookies</span>
                </label>
              )}
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Your Data Rights</h2>
            <p style={{ marginBottom: '15px' }}>You have the right to:</p>
            <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
              <li>Access your stored puzzle progress</li>
              <li>Update your cookie preferences at any time</li>
              <li>Delete all your saved data</li>
              <li>Withdraw consent for non-essential cookies</li>
            </ul>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="btn btn-danger" 
                onClick={handleClearAllData}
                style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white !important' }}
              >
                Clear All My Data
              </button>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Data Security</h2>
            <p style={{ marginBottom: '15px' }}>
              All data is stored locally in your browser using secure cookie technology. 
              We do not transmit your puzzle progress to external servers. Your data stays on your device.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Data Retention</h2>
            <p style={{ marginBottom: '15px' }}>
              Puzzle progress is stored for 30 days from your last activity. 
              Cookie consent preferences are stored for 1 year. You can clear this data at any time.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Contact Us</h2>
            <p style={{ marginBottom: '15px' }}>
              If you have questions about this privacy policy or your data, 
              please contact us at benjifishbaum@gmail.com
            </p>
          </section>

          <section>
            <p style={{ fontSize: '14px', color: '#6c757d', textAlign: 'center' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};