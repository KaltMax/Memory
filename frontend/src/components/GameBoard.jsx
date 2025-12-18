// src/GameBoard.jsx
import { useEffect, useState } from 'react';
import { addHighScore } from '../services/scoreService';
import PropTypes from 'prop-types';
import Card from './Card';
import cardData from '../data/cards';

const GameBoard = ({ setAttempts, gameStarted, attempts, seconds, setLastScore, setShowHighscore }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    const shuffled = [...cardData].sort(() => 0.5 - Math.random());
    const initialized = shuffled.map((card) => ({
      ...card,
      isFlipped: false,
      isMatched: false
    }));
    setCards(initialized);
  }, []);

  const handleFlip = (index) => {
    if (!gameStarted || flipped.length === 2 || cards[index].isMatched || cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [firstIdx, secondIdx] = newFlipped;
        if (newCards[firstIdx].pairID === newCards[secondIdx].pairID) {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setMatchedPairs((prev) => prev + 1);
        } else {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
        }

        setCards(newCards);
        setFlipped([]);
        setAttempts((prev) => prev + 1);

        if (matchedPairs + 1 === newCards.length / 2) {
          const score = Math.max(0, 1000 - (attempts + 1) * 10 - seconds);
          addHighScore(score);
          setLastScore(score);
          setTimeout(() => {
            setShowHighscore(true);
          }, 200);
        }
      }, 1000);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex items-center justify-center bg-[#1F1F1F] p-4 rounded-xl w-[95vw]">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Card
              key={`${card.name}-${index}`}
              image={card.name}
              isFlipped={gameStarted && (card.isFlipped || card.isMatched)}
              onClick={() => handleFlip(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

GameBoard.propTypes = {
  setAttempts: PropTypes.func.isRequired,
  gameStarted: PropTypes.bool.isRequired,
  attempts: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  setLastScore: PropTypes.func.isRequired,
  setShowHighscore: PropTypes.func.isRequired,
};

export default GameBoard;
