-- Backgammon Game Database Schema

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'finished'
  winner TEXT,
  game_state JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP
);

-- Game moves table (for move history and real-time sync)
CREATE TABLE IF NOT EXISTS game_moves (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  move JSONB NOT NULL, -- {from, to, die, hits}
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Players table (optional, for player stats and ratings)
CREATE TABLE IF NOT EXISTS players (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  rating INT DEFAULT 1500,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Game results/stats
CREATE TABLE IF NOT EXISTS game_results (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  winner_name TEXT NOT NULL,
  loser_name TEXT NOT NULL,
  winner_rating_before INT,
  winner_rating_after INT,
  loser_rating_before INT,
  loser_rating_after INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (optional, for multi-user support)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_created_at ON games(created_at);
CREATE INDEX idx_game_moves_game_id ON game_moves(game_id);
CREATE INDEX idx_game_moves_timestamp ON game_moves(timestamp);
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_game_results_game_id ON game_results(game_id);
