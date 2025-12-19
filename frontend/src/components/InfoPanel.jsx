import PropTypes from 'prop-types';
import { UserCircleIcon, ArrowRightStartOnRectangleIcon, PlayIcon, TrophyIcon } from '@heroicons/react/24/outline';

const InfoPanel = ({ playerName, attempts, seconds, gameStarted, onStartClick, onHighscoreClick, isAuthenticated, onLogout }) => {
  return (
    <div className="bg-[#1F1F1F] p-4 rounded-xl w-[95vw] flex flex-col space-y-4 items-center mb-4 min-h-[160px] justify-center">
      {isAuthenticated && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700/50">
            <UserCircleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{playerName}</span>
          </div>
          <button
            className="flex items-center gap-1.5 bg-gray-800/50 hover:bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700/50 hover:border-red-500/50 hover:text-white text-sm font-medium transition-all duration-200 ease-in-out group"
            onClick={onLogout}
            title="Logout"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>Logout</span>
          </button>
        </div>
      )}
      {gameStarted ? (
        <div className="flex gap-8 py-2 text-center">
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
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onStartClick}
          >
            <PlayIcon className="w-5 h-5" />
            Start Game
          </button>
          <button
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-600/30 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onHighscoreClick}
          >
            <TrophyIcon className="w-5 h-5" />
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