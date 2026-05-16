import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from '../screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockOnLogin = jest.fn();
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome title and quick login', () => {
    render(<WelcomeScreen onLogin={mockOnLogin} onNavigate={mockOnNavigate} />);
    expect(screen.getByText(/Velkommen til/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('calls onLogin when LOG IND is clicked', () => {
    render(<WelcomeScreen onLogin={mockOnLogin} onNavigate={mockOnNavigate} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Søren' } });
    
    const loginButton = screen.getByText(/LOG IND/i);
    fireEvent.click(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith('Søren', false);
  });
});
