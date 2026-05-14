import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectGameScreen from '../screens/SelectGameScreen';

describe('SelectGameScreen', () => {
  const mockOnNavigate = jest.fn();
  const mockOnGameChosen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders opponent name and game options', () => {
    render(
      <SelectGameScreen 
        onNavigate={mockOnNavigate} 
        opponentName="Søren" 
        onGameChosen={mockOnGameChosen} 
      />
    );
    
    expect(screen.getByText(/Vælg Spil/i)).toBeInTheDocument();
    expect(screen.getByText(/Søren/i)).toBeInTheDocument();
    expect(screen.getByText(/Backgammon/i)).toBeInTheDocument();
  });

  test('navigates back to matchmaking on back button click', () => {
    render(
      <SelectGameScreen 
        onNavigate={mockOnNavigate} 
        opponentName="Søren" 
        onGameChosen={mockOnGameChosen} 
      />
    );
    
    const backButton = screen.getByText('<');
    fireEvent.click(backButton);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('matchmaking');
  });

  test('calls onGameChosen when a game is clicked', () => {
    render(
      <SelectGameScreen 
        onNavigate={mockOnNavigate} 
        opponentName="Søren" 
        onGameChosen={mockOnGameChosen} 
      />
    );
    
    const backgammonCard = screen.getByText(/Backgammon/i).closest('.game-card');
    fireEvent.click(backgammonCard);
    
    expect(mockOnGameChosen).toHaveBeenCalledWith('backgammon');
  });
});
