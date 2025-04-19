import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../src/utils/imageLoader', () => ({
    default: {
      '../assets/memoryBg.png': 'mocked-back.png',
      '../assets/card1.png': 'mocked-front.png',
    }
}));

import App from '../src/App';

describe('App integration', () => {
  it('shows the EnterNameModal when "Start Game" is clicked', () => {
    render(<App />);
    
    const startBtn = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/What's your name/i)).toBeInTheDocument();
  });

  it('renders InfoPanel and GameBoard after entering name', () => {
    render(<App />);
    
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: 'Herbert' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));

    expect(screen.getByText(/player: Herbert/i)).toBeInTheDocument();
    expect(screen.getByText(/attempts:/i)).toBeInTheDocument();
  });

  it('opens Highscore modal when Show Highscore is clicked', () => {
    render(<App />);
  
    const highscoreBtn = screen.getByRole('button', { name: /show highscore/i });
    fireEvent.click(highscoreBtn);
  
    expect(screen.getByText(/highscores/i)).toBeInTheDocument();
  });
});
