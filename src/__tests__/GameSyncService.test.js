import { GameSyncService } from '../services/GameSyncService';
import { supabase } from '../supabaseClient';

// Mock Supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
  },
}));

describe('GameSyncService', () => {
  let service;
  let mockFrom;
  let mockChannel;

  beforeEach(() => {
    service = new GameSyncService('test-game-id');
    
    mockFrom = {
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'test-game-id', player1_name: 'Anna' }, error: null })
    };

    // For insert/update which are followed by select()
    mockFrom.insert.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [{ id: 'test-game-id' }], error: null })
    });

    mockFrom.update.mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [{ id: 'test-game-id', status: 'finished' }], error: null })
      })
    });

    mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    };

    supabase.from.mockReturnValue(mockFrom);
    supabase.channel.mockReturnValue(mockChannel);
    
    jest.clearAllMocks();
  });


  test('should create a new game', async () => {
    const game = await service.createGame('Anna', 'Søren');
    expect(supabase.from).toHaveBeenCalledWith('games');
    expect(game.id).toBe('test-game-id');
  });

  test('should get game state', async () => {
    const state = await service.getGameState();
    expect(state.player1_name).toBe('Anna');
  });

  test('should finish a game', async () => {
    const result = await service.finishGame('Anna');
    expect(result.status).toBe('finished');
  });

  test('should subscribe to updates', () => {
    const callback = jest.fn();
    service.subscribeToGame(callback);
    expect(supabase.channel).toHaveBeenCalledWith(expect.stringMatching(/^game-test-game-id-/));
  });
});
