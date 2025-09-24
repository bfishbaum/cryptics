import React from 'react';

export const SupportPage: React.FC = () => {
  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Support</h1>

        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Need Help?</h2>
            <p style={{ marginBottom: '15px' }}>
              If you're experiencing issues with the cryptogram puzzles or have questions about how to solve them,
              check the about page!
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>How to Contact Us</h2>
            <p style={{ marginBottom: '15px' }}>
              For technical support, bug reports, or general inquiries, please reach out to us via email:
            </p>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '6px',
              border: '1px solid #dee2e6',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <strong style={{ fontSize: '18px' }}>
                <a href="mailto:mcfishbombdev@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>
                  mcfishbombdev@gmail.com
                </a>
              </strong>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Common Issues</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Puzzle Not Loading</h3>
              <p style={{ marginBottom: '10px' }}>
                Try refreshing the page or clearing your browser cache. If the issue persists, please contact us.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Lost Progress</h3>
              <p style={{ marginBottom: '10px' }}>
                Your puzzle progress is saved locally in your browser. Make sure functional cookies are enabled
                in your Privacy settings to save your progress.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Solution Not Accepting</h3>
              <p style={{ marginBottom: '10px' }}>
                Remember that cryptogram solutions ignore spaces and hyphens - you only need to enter the letters.
                The checking is case-insensitive, so you can use uppercase or lowercase letters.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Feature Requests</h2>
            <p style={{ marginBottom: '15px' }}>
              Have an idea for improving the site? We'd love to hear from you! Send us your suggestions
              and we'll consider them for future updates.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Bug Reports</h2>
            <p style={{ marginBottom: '15px' }}>
              Found a bug? Please include the following information in your email:
            </p>
            <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
              <li>What you were trying to do</li>
              <li>What happened instead</li>
              <li>Your browser and operating system</li>
              <li>Steps to reproduce the issue</li>
            </ul>
            <p style={{ marginBottom: '15px' }}>
              The more details you provide, the faster we can identify and fix the problem!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};