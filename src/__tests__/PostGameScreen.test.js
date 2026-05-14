import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostGameScreen from '../screens/PostGameScreen';

describe('PostGameScreen', () => {
  const mockOnNavigate = jest.fn();

  test('renders game results and navigation buttons', () => {
    render(<PostGameScreen onNavigate={mockOnNavigate} player1Name="Anna" player2Name="Søren" />);
    expect(screen.getByText(/Spil Afsluttet/i)).toBeInTheDocument();
    expect(screen.getByText(/SPIL IGEN/i)).toBeInTheDocument();
    expect(screen.getByText('[ AFSLUT ]')).toBeInTheDocument();
  });

  test('clears URL and navigates on Spil Igen click', () => {
    // Mock history.replaceState
    const replaceStateMock = jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    
    render(<PostGameScreen onNavigate={mockOnNavigate} player1Name="Anna" player2Name="Søren" />);
    const playAgainBtn = screen.getByText(/SPIL IGEN/i);
    fireEvent.click(playAgainBtn);
    
    expect(replaceStateMock).toHaveBeenCalled();
    expect(mockOnNavigate).toHaveBeenCalledWith('select_game');
    
    replaceStateMock.mockRestore();
  });
});
