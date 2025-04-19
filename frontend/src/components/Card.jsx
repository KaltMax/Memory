import PropTypes from 'prop-types';
import images from '../utils/imageLoader';

const Card = ({ image, isFlipped, onClick }) => {
  const frontImage = images[`../assets/${image}`];
  const backImage = images['../assets/memoryBg.png'];

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
};

export default Card;
