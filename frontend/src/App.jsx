import { useState, useEffect, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GameBoard from './components/GameBoard';
import InfoPanel from './components/InfoPanel';
import AuthModal from './components/AuthModal';
import HighscoreModal from './components/HighscoreModal';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHighscore, setShowHighscore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const handleStartButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setGameStarted(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setGameStarted(true);
  };

  const handleHighscoreButtonClick = () => {
    setShowHighscore(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#6E7681] flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6E7681] p-4 text-white font-sans">
      {showAuthModal && <AuthModal onClose={handleAuthSuccess} />}
      {showHighscore && (
        <HighscoreModal
          onClose={() => window.location.reload()}
          highlightPlayer={user?.username}
          highlightScore={lastScore}
        />)}

      <div className="flex flex-col items-center justify-center h-full">
        <InfoPanel
          playerName={user?.username || 'Guest'}
          attempts={attempts}
          seconds={seconds}
          gameStarted={gameStarted}
          onStartClick={handleStartButtonClick}
          onHighscoreClick={handleHighscoreButtonClick}
        />
        <GameBoard
          setAttempts={setAttempts}
          gameStarted={gameStarted}
          playerName={user?.username || 'Guest'}
          attempts={attempts}
          seconds={seconds}
          setLastScore={setLastScore}
          setShowHighscore={setShowHighscore}
          />
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        theme="dark"
      />
    </div>
  );
};

export default App;
