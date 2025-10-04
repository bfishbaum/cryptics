import React, { useState } from 'react';
import { getCookieConsent, setCookieConsent, deleteNonEssentialCookies } from '../utils/cookies';
import { clearAllPuzzleProgress } from '../utils/puzzleProgress';

export const PrivacyPage: React.FC = () => {
  const [currentConsent, setCurrentConsent] = useState(getCookieConsent());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleConsentChange = (type: 'functional' | 'analytics' | 'marketing', value: boolean) => {
    if (!currentConsent) return;

    const updatedConsent = { ...currentConsent, [type]: value };
    setCookieConsent(updatedConsent);
    setCurrentConsent(updatedConsent);

    if (type === 'functional' && !value) {
      deleteNonEssentialCookies();
      clearAllPuzzleProgress();
    }

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleClearAllData = () => {
    if (window.confirm('Clear all saved puzzle progress and preferences?')) {
      clearAllPuzzleProgress();
      deleteNonEssentialCookies();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Privacy Policy</h1>
        {showSuccessMessage && (
          <div
            style={{
              background: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              border: '1px solid #c3e6cb',
              textAlign: 'center'
            }}
          >
            Preferences updated successfully.
          </div>
        )}
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Introduction</h2>
            <p style={{ marginBottom: '12px' }}>
              Cryptic Clues (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) values your privacy. This Privacy Policy
              explains how we collect, use, store, and share information when you access or use our puzzles,
              service.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Information We Collect</h2>
            <p style={{ marginBottom: '12px' }}>We may collect the following categories of information:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li>Account information you provide when you register or sign in.</li>
              <li>Puzzle submissions, solutions, comments, and other content you upload or create.</li>
              <li>Usage information about how you interact with the Service, including device and browser data.</li>
              <li>Cookies and similar technologies that help us remember your preferences and improve performance.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>How We Use Your Information</h2>
            <p style={{ marginBottom: '12px' }}>We use collected information to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li>Operate, maintain, and improve the Service and its features.</li>
              <li>Communicate with you about updates, puzzles, and support requests.</li>
              <li>Personalize your experience, including remembering puzzle progress and preferences.</li>
              <li>Monitor usage trends, troubleshoot issues, and protect the security of the Service.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Cookies and Tracking Technologies</h2>
            <p style={{ marginBottom: '12px' }}>
              We use cookies and similar technologies to keep you signed in, remember puzzle progress, and
              understand how the Service is used. You can manage cookie preferences through your browser
              settings. Disabling cookies may limit certain functionality.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>User-Submitted Puzzles and Content Ownership</h2>
            <p style={{ marginBottom: '12px' }}>
              By submitting puzzles, solutions, explanations, or other content to the Service, you grant
              Cryptic Clues a perpetual, worldwide, irrevocable, royalty-free, and fully transferable license
              to use, host, reproduce, modify, adapt, publish, and distribute that content in any media. All
              puzzles submitted through the Service become the property of Cryptic Clues, and we may use them
              in any commercial or non-commercial manner without further notice or compensation to you.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Sharing of Information</h2>
            <p style={{ marginBottom: '12px' }}>
              We do not sell personal information. We may share information with trusted service providers who
              assist us in operating the Service, complying with legal obligations, or protecting the rights and
              safety of Cryptic Clues and its users. These providers are obligated to safeguard your data and may
              use it only for the services they perform for us.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Data Retention and Security</h2>
            <p style={{ marginBottom: '12px' }}>
              We retain information for as long as necessary to provide the Service and fulfill the purposes
              described in this Privacy Policy. We implement reasonable technical and organizational safeguards
              to protect your information, but no system is completely secure. You use the Service at your own
              risk.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Children&apos;s Privacy</h2>
            <p style={{ marginBottom: '12px' }}>
              The Service is not directed to children under 13. We do not knowingly collect personal
              information from children under 13. If we learn that we have collected such information, we will
              delete it promptly.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Your Choices</h2>
            <p style={{ marginBottom: '12px' }}>
              You may update account information, manage notification settings, or request deletion of stored
              data by contacting us. Depending on your location, you may have additional rights under applicable
              privacy laws, including the ability to access, correct, or delete your personal information.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Changes to This Policy</h2>
            <p style={{ marginBottom: '12px' }}>
              We may update this Privacy Policy periodically. When we do, we will revise the &ldquo;Last Updated&rdquo;
              date below. Continued use of the Service after changes become effective constitutes acceptance of
              the revised policy.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Contact Us</h2>
            <p style={{ marginBottom: '12px' }}>
              If you have questions about this Privacy Policy or our data practices, please contact us at
              <a href="mailto:mcfishbombdev@gmail.com" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '4px' }}>
                mcfishbombdev@gmail.com
              </a>.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Manage Cookies and Preferences</h2>
            <p style={{ marginBottom: '12px' }}>
              You can adjust your cookie preferences at any time. Disabling functional cookies will remove saved
              puzzle progress and may limit certain features.
            </p>
            {currentConsent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.functional}
                    onChange={(e) => handleConsentChange('functional', e.target.checked)}
                  />
                  <span>Allow functional cookies (save puzzle progress and preferences)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.analytics}
                    onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                  />
                  <span>Allow analytics cookies (help us understand usage)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={currentConsent.marketing}
                    onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                  />
                  <span>Allow marketing cookies (personalized content)</span>
                </label>
              </div>
            ) : (
              <p style={{ marginBottom: '16px' }}>
                Cookie preferences are not available at this time. Try reloading the page to manage your settings.
              </p>
            )}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="btn btn-danger"
                onClick={handleClearAllData}
                style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white !important' }}
              >
                Clear All Saved Data
              </button>
            </div>
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