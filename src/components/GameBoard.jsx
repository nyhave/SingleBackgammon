/**
 * Backgammon Board Component
 * Displays the game board and pieces compactly for mobile
 */

import React from 'react'

export default function GameBoard({ gameState, onPointClick, selectedPoint, validDestinations = [] }) {
  if (!gameState || !gameState.board) return <div style={{padding: 20}}>Indlæser bræt...</div>

  const { board, bar, borne_off } = gameState

  // Render a single point (triangle)
  const renderPoint = (pointIndex, isTopHalf) => {
    const point = board[pointIndex]
    const pieces = Math.max(point.player1, point.player2)
    const owner = point.player1 > 0 ? 'player1' : point.player2 > 0 ? 'player2' : null
    
    const isSelected = selectedPoint === pointIndex
    const isValidDest = validDestinations.includes(pointIndex)
    const isDark = pointIndex % 2 === (isTopHalf ? 0 : 1)
    
    // Triangle colors
    const triangleColor = isDark ? '#b03a2e' : '#212f3d'
    const highlightColor = isSelected ? '#f1c40f' : (isValidDest ? '#2ecc71' : 'transparent')

    return (
      <div
        key={pointIndex}
        onClick={() => onPointClick(pointIndex)}
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: isTopHalf ? 'column' : 'column-reverse',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {/* The Triangle Background */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: triangleColor,
          clipPath: isTopHalf ? 'polygon(0 0, 100% 0, 50% 100%)' : 'polygon(50% 0, 0 100%, 100% 100%)',
          borderTop: isTopHalf && (isSelected || isValidDest) ? `4px solid ${highlightColor}` : 'none',
          borderBottom: !isTopHalf && (isSelected || isValidDest) ? `4px solid ${highlightColor}` : 'none',
          opacity: (isSelected || isValidDest) ? 1 : 0.8,
          boxShadow: isValidDest ? `inset 0 0 15px ${highlightColor}` : 'none'
        }} />

        {/* Destination Highlight Dot */}
        {isValidDest && (
          <div style={{
            position: 'absolute',
            top: isTopHalf ? '15px' : 'auto',
            bottom: !isTopHalf ? '15px' : 'auto',
            width: '10px',
            height: '10px',
            backgroundColor: '#2ecc71',
            borderRadius: '50%',
            zIndex: 3,
            boxShadow: '0 0 8px #2ecc71'
          }} />
        )}

        {/* The Pieces */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: isTopHalf ? 'column' : 'column-reverse',
          paddingTop: isTopHalf ? '2px' : '0',
          paddingBottom: !isTopHalf ? '2px' : '0',
          height: '100%'
        }}>
          {Array(Math.min(pieces, 5)).fill(null).map((_, i) => (
            <div
              key={i}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: owner === 'player1' ? '#fdfefe' : '#17202a',
                border: '2px solid #7f8c8d',
                marginBottom: isTopHalf ? '-4px' : '0',
                marginTop: !isTopHalf ? '-4px' : '0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {i === 4 && pieces > 5 && (
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: owner === 'player1' ? '#000' : '#fff' }}>
                  +{pieces - 4}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#e67e22', /* Wood outer frame */
      padding: '10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
    }}>
      
      {/* Inner Wood Board */}
      <div style={{
        flex: 1,
        backgroundColor: '#f5b041', /* Light wood inner */
        display: 'flex',
        border: '4px solid #935116',
        borderRadius: '4px',
      }}>
        
        {/* Left half (Points 12-23 top, 11-0 bottom if player 2 is top) */}
        {/* For simplicity we just map 12 points left, 12 points right */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Left */}
          <div style={{ flex: 1, display: 'flex' }}>
             {Array(6).fill(null).map((_, i) => renderPoint(12 + i, true))}
          </div>
          {/* Bottom Left */}
          <div style={{ flex: 1, display: 'flex' }}>
             {Array(6).fill(null).map((_, i) => renderPoint(11 - i, false))}
          </div>
        </div>

        {/* Central Bar */}
        <div 
          onClick={() => onPointClick('bar')}
          style={{
            width: '30px',
            backgroundColor: '#935116',
            borderLeft: '2px solid #6e2c00',
            borderRight: '2px solid #6e2c00',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: selectedPoint === 'bar' ? '0 0 10px #f1c40f' : 'none'
          }}
        >
           <div style={{ marginBottom: 20 }}>
             B<br/>A<br/>R
             {bar.player2 > 0 && <div style={{width: 18, height: 18, borderRadius: '50%', backgroundColor: '#17202a', margin: '5px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #7f8c8d'}}>{bar.player2}</div>}
           </div>
           <div>
             {bar.player1 > 0 && <div style={{width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fdfefe', color: '#000', margin: '5px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #7f8c8d'}}>{bar.player1}</div>}
           </div>
        </div>

        {/* Right half */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Right */}
          <div style={{ flex: 1, display: 'flex' }}>
             {Array(6).fill(null).map((_, i) => renderPoint(18 + i, true))}
          </div>
          {/* Bottom Right */}
          <div style={{ flex: 1, display: 'flex' }}>
             {Array(6).fill(null).map((_, i) => renderPoint(5 - i, false))}
          </div>
        </div>

        {/* Bearing Off Area (Right Side) */}
        <div 
          onClick={() => onPointClick('borne_off')}
          style={{
            width: '40px',
            backgroundColor: '#5d4037',
            borderLeft: '2px solid #3e2723',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: validDestinations.includes('borne_off') ? 'inset 0 0 15px #2ecc71' : 'none',
          }}
        >
          {validDestinations.includes('borne_off') && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '15px', height: '15px', backgroundColor: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 10px #2ecc71'
            }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <span style={{ fontSize: '10px', color: '#fff', marginBottom: '5px' }}>P2</span>
            <div style={{ width: '25px', height: '40px', backgroundColor: '#17202a', border: '1px solid #7f8c8d', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {borne_off.player2}
            </div>
          </div>
          <div style={{ transform: 'rotate(-90deg)', color: '#fff', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>UT / OFF</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div style={{ width: '25px', height: '40px', backgroundColor: '#fdfefe', border: '1px solid #7f8c8d', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              {borne_off.player1}
            </div>
            <span style={{ fontSize: '10px', color: '#fff', marginTop: '5px' }}>P1</span>
          </div>
        </div>

      </div>

    </div>
  )
}
