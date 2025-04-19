import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HighscoreModal from '../src/components/HighscoreModal';
import { getHighScoreList } from '../src/data/scoreService';

jest.mock('../src/data/scoreService', () => ({
  getHighScoreList: jest.fn(),
}));


describe('HighscoreModal', () => {
  beforeEach(() => {
    getHighScoreList.mockResolvedValue([
      { name: 'Alice', score: 900 },
      { name: 'Bob', score: 800 },
      { name: 'Charlie', score: 700 },
    ]);
  });

  it('renders heading and close button', () => {
    render(<HighscoreModal onClose={jest.fn()} />);
    expect(screen.getByText('Highscores')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('displays high score entries with correct medals and scores', async () => {
    render(<HighscoreModal onClose={jest.fn()} />);

    expect(await screen.findByText('🥇 Alice')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();

    expect(screen.getByText('🥈 Bob')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();

    expect(screen.getByText('🥉 Charlie')).toBeInTheDocument();
    expect(screen.getByText('700')).toBeInTheDocument();
  });


  it('highlights the correct player and score', async () => {
    render(<HighscoreModal onClose={jest.fn()} highlightPlayer="Bob" highlightScore={800} />);

    const highlighted = await screen.findByText('🥈 Bob');
    expect(highlighted.closest('li')).toHaveClass('bg-yellow-100');
  });

  it('calls onClose when Close button is clicked', () => {
    const mockClose = jest.fn();
    render(<HighscoreModal onClose={mockClose} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockClose).toHaveBeenCalled();
  });
});
