// tests/Card.test.jsx
import { render, fireEvent } from '@testing-library/react';
import Card from '../src/components/Card';

jest.mock('../src/utils/imageLoader', () => ({
  default: {
    '../assets/memoryBg.png': 'back.png',
    '../assets/memoryBgI.png': 'back-inactive.png',
    '../assets/card1.png': 'front.png',
  },
}));

describe('Card', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card image="card1.png" isFlipped={false} onClick={handleClick} gameStarted={true} />);
    const cardContainer = container.querySelector('.card-container');
    fireEvent.click(cardContainer);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies flipped class when isFlipped is true', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card image="card1.png" isFlipped={true} onClick={handleClick} gameStarted={true} />);
    const cardElement = container.querySelector('.card');
    expect(cardElement).toHaveClass('flipped');
  });

  it('does not apply flipped class when isFlipped is false', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card image="card1.png" isFlipped={false} onClick={handleClick} gameStarted={true} />);
    const cardElement = container.querySelector('.card');
    expect(cardElement).not.toHaveClass('flipped');
  });

  it('renders card-back and card-front faces', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card image="card1.png" isFlipped={false} onClick={handleClick} gameStarted={true} />);
    const backFace = container.querySelector('.card-back');
    const frontFace = container.querySelector('.card-front');
    expect(backFace).toBeInTheDocument();
    expect(frontFace).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const handleClick = jest.fn();
    const { container } = render(<Card image="card1.png" isFlipped={false} onClick={handleClick} gameStarted={true} />);
    const cardContainer = container.querySelector('.card-container');
    const card = container.querySelector('.card');
    expect(cardContainer).toBeInTheDocument();
    expect(card).toBeInTheDocument();
  });
});