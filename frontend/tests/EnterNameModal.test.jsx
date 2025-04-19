import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EnterNameModal from '../src/components/EnterNameModal';

describe('EnterNameModal', () => {
  it('renders modal and input elements', () => {
    render(<EnterNameModal onSubmit={jest.fn()} />);
    expect(screen.getByText("What's your name?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your Name...')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('calls onSubmit with entered name when "Start" is clicked', () => {
    const mockSubmit = jest.fn();
    render(<EnterNameModal onSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Enter Your Name...');
    const button = screen.getByText('Start');

    fireEvent.change(input, { target: { value: 'Max' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Max');
  });

  it('calls onSubmit with "Unknown Player" when input is empty', () => {
    const mockSubmit = jest.fn();
    render(<EnterNameModal onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByText('Start'));
    expect(mockSubmit).toHaveBeenCalledWith('Unknown Player');
  });

  it('calls onSubmit when Enter key is pressed', () => {
    const mockSubmit = jest.fn();
    render(<EnterNameModal onSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Enter Your Name...');

    fireEvent.change(input, { target: { value: 'Lena' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSubmit).toHaveBeenCalledWith('Lena');
  });

  it('trims whitespace from name before submitting', () => {
    const mockSubmit = jest.fn();
    render(<EnterNameModal onSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Enter Your Name...');
    fireEvent.change(input, { target: { value: '   Alice   ' } });
    fireEvent.click(screen.getByText('Start'));

    expect(mockSubmit).toHaveBeenCalledWith('Alice');
  });
});
