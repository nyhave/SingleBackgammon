/**
 * Supabase Game Sync Service
 * Handles real-time synchronization of game state between players
 */

import { supabase } from '../supabaseClient'

export class GameSyncService {
  constructor(gameId) {
    this.gameId = gameId
    this.listeners = []
    this.subscription = null
  }

  /**
   * Create a new game in database
   */
  async createGame(player1Name, player2Name, initialState = null) {
    try {
      const defaultState = {
        board: null,
        bar: { player1: 0, player2: 0 },
        borne_off: { player1: 0, player2: 0 },
        currentPlayer: 'player1',
        dice: [0, 0],
        availableDice: [],
        gameState: 'rolling',
        moves: []
      };
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          player1_name: player1Name,
          player2_name: player2Name,
          status: 'active',
          game_state: initialState || defaultState,
          created_at: new Date()
        })
        .select()

      if (error) throw error
      this.gameId = data[0].id
      return data[0]
    } catch (err) {
      console.error('Fejl ved oprettelse af spil:', err)
      throw err
    }
  }

  /**
   * Subscribe to real-time game updates
   */
  subscribeToGame(onUpdate) {
    try {
      // Ensure we don't subscribe multiple times to the same instance
      if (this.subscription) {
        this.unsubscribe();
      }

      // Use a unique channel name for this instance to avoid conflicts
      const channelName = `game-${this.gameId}-${Math.random().toString(36).substring(7)}`;
      
      this.subscription = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'games',
            filter: `id=eq.${this.gameId}`
          },
          (payload) => {
            if (payload.new) {
              onUpdate(payload.new)
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`✓ Tilsluttet realtime kanal: ${channelName}`);
          }
        })


      return this.subscription
    } catch (err) {
      console.error('Fejl ved subscription:', err)
      throw err
    }
  }

  /**
   * Update game state
   */
  async updateGameState(gameState) {
    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          game_state: gameState,
          updated_at: new Date()
        })
        .eq('id', this.gameId)
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Fejl ved opdatering af spiltilstand:', err)
      throw err
    }
  }

  /**
   * Get active games for a player
   */
  async getActiveGames(playerName) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`player1_name.eq."${playerName}",player2_name.eq."${playerName}"`)
        .order('updated_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data
    } catch (err) {
      console.error('Fejl ved hentning af aktive spil:', err)
      return []
    }
  }

  /**
   * Get current game state
   */
  async getGameState() {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', this.gameId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Fejl ved hentning af spiltilstand:', err)
      throw err
    }
  }

  /**
   * Log a move
   */
  async logMove(playerName, move) {
    try {
      const { data, error } = await supabase
        .from('game_moves')
        .insert({
          game_id: this.gameId,
          player_name: playerName,
          move: move,
          timestamp: new Date()
        })
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Fejl ved logging af træk:', err)
      throw err
    }
  }

  /**
   * Finish game
   */
  async finishGame(winner) {
    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          status: 'finished',
          winner: winner,
          finished_at: new Date()
        })
        .eq('id', this.gameId)
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Fejl ved afslutning af spil:', err)
      throw err
    }
  }

  /**
   * Delete a game
   */
  async deleteGame(gameId) {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Fejl ved sletning af spil:', err)
      throw err
    }
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}

export default GameSyncService
