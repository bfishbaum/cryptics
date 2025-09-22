import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header, NavigationMenu } from './components/Header';
import { CookieConsent } from './components/CookieConsent';
import { MainPage } from './pages/MainPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { ArchivePage } from './pages/ArchivePage';
import { SubmissionPage } from './pages/SubmissionPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { AboutPage } from './pages/AboutPage';
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const basename = import.meta.env.MODE === 'production' ? '/cryptics' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <div className="App">
          <NavigationMenu />
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/puzzle" element={<PuzzlePage />} />
              <Route path="/puzzle/:id" element={<PuzzlePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/submit" element={<SubmissionPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <CookieConsent />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
