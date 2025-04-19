import PropTypes from 'prop-types';

const InfoPanel = ({ playerName, attempts, seconds, gameStarted, onStartClick, onHighscoreClick }) => {
  return (
    <div className="bg-[#1F1F1F] p-4 rounded-xl w-[95vw] flex flex-col space-y-4 items-center mb-4">
      {gameStarted ? (
        <>
          <div className="text-lg font-semibold">Player: {playerName}</div>
          <div className="text-lg font-semibold">Attempts: {attempts}</div>
          <div className="text-lg font-semibold">Time: {seconds}s</div>
        </>
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
};

export default InfoPanel;