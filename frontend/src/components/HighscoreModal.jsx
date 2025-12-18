import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getHighScoreList } from '../services/scoreService';

const HighscoreModal = ({ onClose, highlightPlayer = null, highlightScore = null }) => {
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    async function fetchHighscores() {
      try {
        const data = await getHighScoreList();
        setHighscores(data);
      } catch (err) {
        console.error('Failed to fetch highscores:', err);
      }
    }

    fetchHighscores();
  }, []);

  function getMedalByRank(index) {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}.`;
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1F1F1F] bg-opacity-60 z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-5 text-center">Highscores</h1>

        <ul className="mb-4 max-h-80 overflow-y-auto pr-2">
          {highscores.map((entry, index) => {
            const isHighlighted = entry.name === highlightPlayer && entry.score === highlightScore;
            const medal = getMedalByRank(index);

            return (
              <li
                key={`${entry.name}-${entry.score}-${index}`}
                className={`flex justify-between text-l mb-2 font-semibold border-b-2 border-gray-300 pb-2 ${
                  isHighlighted ? 'bg-yellow-100 text-black rounded px-2' : ''
                }`}
              >
                <span>{medal} {entry.name}</span>
                <span>{entry.score}</span>
              </li>
            );
          })}
        </ul>

        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
};

HighscoreModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  highlightPlayer: PropTypes.string,
  highlightScore: PropTypes.number,
};

export default HighscoreModal;
