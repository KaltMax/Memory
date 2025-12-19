import PropTypes from 'prop-types';

const InfoPanel = ({ playerName, attempts, seconds, gameStarted, onStartClick, onHighscoreClick, isAuthenticated, onLogout }) => {
  return (
    <div className="bg-[#1F1F1F] p-4 rounded-xl w-[95vw] flex flex-col space-y-4 items-center mb-4 min-h-[150px] justify-center relative">
      {isAuthenticated && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Logged in as </span>
            <span className="font-semibold">{playerName}</span>
          </div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
      {gameStarted ? (
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-200 mb-1">Player</div>
            <div className="text-2xl font-bold">{playerName}</div>
          </div>
          <div className="border-l border-gray-600 pl-8">
            <div className="text-xs uppercase tracking-wider text-gray-200 mb-1">Attempts</div>
            <div className="text-2xl font-bold">{attempts}</div>
          </div>
          <div className="border-l border-gray-600 pl-8">
            <div className="text-xs uppercase tracking-wider text-gray-200 mb-1">Time</div>
            <div className="text-2xl font-bold">{seconds}s</div>
          </div>
        </div>
      ) : (
        <div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5"
            onClick={onStartClick}
          >
            Start Game
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5"
            onClick={onHighscoreClick}
          >
            Show Highscore
          </button>
        </div>
      )}
    </div>
  );
};

InfoPanel.propTypes = {
  playerName: PropTypes.string.isRequired,
  attempts: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  gameStarted: PropTypes.bool.isRequired,
  onStartClick: PropTypes.func.isRequired,
  onHighscoreClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default InfoPanel;