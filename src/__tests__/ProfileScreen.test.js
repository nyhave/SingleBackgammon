import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from '../screens/ProfileScreen';

describe('ProfileScreen', () => {
  const mockOnSave = jest.fn();
  const mockOnNavigate = jest.fn();

  test('renders profile fields and save button', () => {
    render(<ProfileScreen onSave={mockOnSave} onNavigate={mockOnNavigate} />);
    expect(screen.getByText(/DIN PROFIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Brugernavn:/i)).toBeInTheDocument();
    expect(screen.getByText(/\[ GEM PROFIL \]/i)).toBeInTheDocument();
  });

  test('calls onSave with input value', () => {
    render(<ProfileScreen onSave={mockOnSave} onNavigate={mockOnNavigate} />);
    const input = screen.getByLabelText(/Brugernavn:/i);
    fireEvent.change(input, { target: { value: 'Anna, 25' } });
    
    const saveButton = screen.getByText(/\[ GEM PROFIL \]/i);
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith('Anna, 25');
  });
});
