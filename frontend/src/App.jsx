// App.jsx
import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import InfoPanel from './components/InfoPanel';
import EnterNameModal from './components/EnterNameModal';
import HighscoreModal from './components/HighscoreModal';

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showHighscore, setShowHighscore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setShowModal(false);
    setGameStarted(true);
  };

  const handleStartButtonClick = () => {
    setShowModal(true);
  };

  const handleHighscoreButtonClick = () => {
    setShowHighscore(true);
  };

  return (
    <div className="min-h-screen bg-[#6E7681] p-4 text-white font-sans">
      {showModal && <EnterNameModal onSubmit={handleNameSubmit} />}
      {showHighscore && (
        <HighscoreModal 
          onClose={() => window.location.reload()}
          highlightPlayer={playerName}
          highlightScore={lastScore} 
        />)}

      <div className="flex flex-col items-center justify-center h-full">
        <InfoPanel
          playerName={playerName}
          attempts={attempts}
          seconds={seconds}
          gameStarted={gameStarted}
          onStartClick={handleStartButtonClick}
          onHighscoreClick={handleHighscoreButtonClick}
        />
        <GameBoard
          setAttempts={setAttempts} 
          gameStarted={gameStarted}
          playerName={playerName}
          attempts={attempts}
          seconds={seconds}
          setLastScore={setLastScore}
          setShowHighscore={setShowHighscore}
          />
      </div>
    </div>
  );
};

export default App;
