// tests/Card.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../src/components/Card';

jest.mock('../src/utils/imageLoader', () => ({
  default: {
    '../assets/memoryBg.png': 'back.png',
    '../assets/card1.png': 'front.png',
  },
}));

describe('Card', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Card image="card1.png" isFlipped={false} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

