/**
 * Connect Four Board Component
 * Renders the 7x6 grid for 4-på-stribe
 */

import React from 'react';
import './ConnectFourBoard.css';

export default function ConnectFourBoard({ gameState, onColumnClick }) {
  if (!gameState || !gameState.board) return null;

  const { board, rows, cols } = gameState;

  // Convert column-based board to row-based for rendering (top to bottom)
  const renderRows = [];
  for (let r = rows - 1; r >= 0; r--) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        value: board[c][r],
        col: c,
        row: r
      });
    }
    renderRows.push(row);
  }

  return (
    <div className="c4-board-container">
      <div className="c4-board-frame">
        {renderRows.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="c4-row">
            {row.map((cell, cIdx) => (
              <div 
                key={`cell-${cIdx}`} 
                className="c4-cell"
                onClick={() => onColumnClick(cell.col)}
              >
                <div className="c4-slot">
                  {cell.value && (
                    <div className={`c4-piece ${cell.value}`}>
                      <div className="c4-piece-inner" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Column indicators (buttons) for accessibility/clicking */}
      <div className="c4-column-pickers">
        {Array(cols).fill(null).map((_, i) => (
          <div 
            key={`picker-${i}`} 
            className="c4-column-picker"
            onClick={() => onColumnClick(i)}
          >
            ↓
          </div>
        ))}
      </div>
    </div>
  );
}
