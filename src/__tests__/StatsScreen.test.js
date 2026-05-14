import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatsScreen from '../screens/StatsScreen';

// Correct mock: code calls .from().select() and awaits it.
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({ 
        data: [
          { id: 1, status: 'finished', player1_name: 'Anna', player2_name: 'Søren', created_at: '2023-01-01T10:00:00', finished_at: '2023-01-01T10:15:00' }
        ], 
        error: null 
      })
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }) })
  }
}));

describe('StatsScreen', () => {
  const mockOnNavigate = jest.fn();

  test('renders stats with correct data', async () => {
    render(<StatsScreen onNavigate={mockOnNavigate} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Platform Statistik/i)).toBeInTheDocument();
    });

    // With 1 game, we should have 2 unique users (Anna and Søren)
    // We use getAllByText because '2' might appear in both the card and the funnel
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
  });
});
