import PropTypes from 'prop-types';
import images from '../utils/imageLoader';

const Card = ({ image, isFlipped, onClick, gameStarted }) => {
  const frontImage = images[`../assets/${image}`];
  const backImageActive = images['../assets/memoryBg.png'];
  const backImageInactive = images['../assets/memoryBgI.png'];

  const backImage = gameStarted ? backImageActive : backImageInactive;

  return (
    <div
      role="button"
      className="w-25 h-25 cursor-pointer bg-cover bg-center rounded"
      style={{
        backgroundImage: `url(${isFlipped ? frontImage : backImage})`,
      }}
      onClick={onClick}
    ></div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  gameStarted: PropTypes.bool.isRequired,
};

export default Card;
