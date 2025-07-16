import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MainPage } from './pages/MainPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { ArchivePage } from './pages/ArchivePage';
import { SubmissionPage } from './pages/SubmissionPage';
import './styles/globals.css';

function App() {
  const basename = import.meta.env.MODE === 'production' ? '/cryptics' : '';
  
  return (
    <Router basename={basename}>
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/puzzle" element={<PuzzlePage />} />
              <Route path="/puzzle/:id" element={<PuzzlePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/submit" element={<SubmissionPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
