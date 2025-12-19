import { useState, useEffect, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GameBoard from './components/GameBoard';
import InfoPanel from './components/InfoPanel';
import AuthModal from './components/AuthModal';
import HighscoreModal from './components/HighscoreModal';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
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
    if (isAuthenticated) {
      setGameStarted(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setGameStarted(true);
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
  };

  const handleHighscoreButtonClick = () => {
    setShowHighscore(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5a6168] to-[#7a8590] flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a6168] to-[#7a8590] p-4 text-white font-sans">
      {showAuthModal && <AuthModal onClose={handleAuthSuccess} onCancel={handleAuthCancel} />}
      {showHighscore && (
        <HighscoreModal
          onClose={() => window.location.reload()}
          highlightPlayer={user?.username}
          highlightScore={lastScore}
        />)}

      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-fit">
          <InfoPanel
            playerName={user?.username}
            attempts={attempts}
            seconds={seconds}
            gameStarted={gameStarted}
            onStartClick={handleStartButtonClick}
            onHighscoreClick={handleHighscoreButtonClick}
            isAuthenticated={isAuthenticated}
            onLogout={logout}
          />
          <GameBoard
            setAttempts={setAttempts}
            gameStarted={gameStarted}
            playerName={user?.username}
            attempts={attempts}
            seconds={seconds}
            setLastScore={setLastScore}
            setShowHighscore={setShowHighscore}
            />
        </div>
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
