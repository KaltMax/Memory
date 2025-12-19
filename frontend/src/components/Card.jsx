import PropTypes from 'prop-types';
import images from '../utils/imageLoader';
import './Card.css';

const Card = ({ image, isFlipped, onClick, gameStarted }) => {
  const frontImage = images[`../assets/${image}`];
  const backImageActive = images['../assets/memoryBg.png'];
  const backImageInactive = images['../assets/memoryBgI.png'];

  const backImage = gameStarted ? backImageActive : backImageInactive;

  return (
    <div className="card-container" onClick={onClick}>
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div
          className="card-face card-back"
          style={{ backgroundImage: `url(${backImage})` }}
        />
        <div
          className="card-face card-front"
          style={{ backgroundImage: `url(${frontImage})` }}
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  gameStarted: PropTypes.bool.isRequired,
};

export default Card;
