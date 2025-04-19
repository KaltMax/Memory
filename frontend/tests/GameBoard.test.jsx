/* eslint-disable react/display-name, react/prop-types */
import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';

jest.mock('../src/components/Card', () => ({ image, isFlipped, onClick }) => (
  <div role="button" data-testid={image} onClick={onClick}>
    {isFlipped ? `Front:${image}` : 'Back'}
  </div>
));

import GameBoard from '../src/components/GameBoard';

jest.mock('../src/data/cards', () => [
  { name: 'card1', pairID: 1 },
  { name: 'card1', pairID: 1 },
  { name: 'card2', pairID: 2 },
  { name: 'card2', pairID: 2 },
]);

jest.mock('../src/data/scoreService', () => ({
  addHighScore: jest.fn(),
}));

describe('handleFlip function', () => {
  let setAttempts, setLastScore, setShowHighscore;

  beforeEach(() => {
    jest.useFakeTimers();
    setAttempts = jest.fn();
    setLastScore = jest.fn();
    setShowHighscore = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('flips one card and updates state', async () => {
    await act(async () => {
      render(
        <GameBoard
          gameStarted={true}
          playerName="Tester"
          attempts={0}
          seconds={0}
          setAttempts={setAttempts}
          setLastScore={setLastScore}
          setShowHighscore={setShowHighscore}
        />
      );
    });

    const cards = screen.getAllByRole('button');
    const firstCard = cards[0];

    fireEvent.click(firstCard);

    expect(firstCard.textContent).toMatch(/^Front:/);
  });

  it('flips two cards and resets if not matched', async () => {
    await act(async () => {
      render(
        <GameBoard
          gameStarted={true}
          playerName="Tester"
          attempts={0}
          seconds={0}
          setAttempts={setAttempts}
          setLastScore={setLastScore}
          setShowHighscore={setShowHighscore}
        />
      );
    });

    const cards = screen.getAllByRole('button');
    const card1 = cards.find((c) => c.dataset.testid === 'card1');
    const card2 = cards.find((c) => c.dataset.testid === 'card2');

    fireEvent.click(card1);
    fireEvent.click(card2);

    expect(card1.textContent).toMatch(/^Front:/);
    expect(card2.textContent).toMatch(/^Front:/);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(card1.textContent).toBe('Back');
    expect(card2.textContent).toBe('Back');
    expect(setAttempts).toHaveBeenCalled();
  });

  it('marks matched cards and does not flip them back', async () => {
    await act(async () => {
      render(
        <GameBoard
          gameStarted={true}
          playerName="Tester"
          attempts={0}
          seconds={0}
          setAttempts={setAttempts}
          setLastScore={setLastScore}
          setShowHighscore={setShowHighscore}
        />
      );
    });

    const cards = screen.getAllByRole('button');
    const matchedCards = cards.filter((c) => c.dataset.testid === 'card1');

    fireEvent.click(matchedCards[0]);
    fireEvent.click(matchedCards[1]);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(matchedCards[0].textContent).toMatch(/^Front:/);
    expect(matchedCards[1].textContent).toMatch(/^Front:/);
    expect(setAttempts).toHaveBeenCalled();
  });
});
