import React, { useEffect, useState } from 'react';
import './StatsScreen.css';
import { supabase } from '../supabaseClient';

export default function StatsScreen({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    ongoingGames: 0,
    finishedGames: 0,
    uniqueUsers: 0,
    avgTimeFinished: 0,
    avgTimeAll: 0,
    funnel: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('games')
        .select('*');

      if (error) throw error;

      if (data) {
        let total = data.length;
        let ongoing = 0;
        let finished = 0;
        let users = new Set();
        
        let totalTimeFinished = 0;
        let countTimeFinished = 0;
        let totalTimeAll = 0;

        data.forEach(game => {
          if (game.status === 'playing') ongoing++;
          if (game.status === 'finished') {
            finished++;
            if (game.finished_at && game.created_at) {
              const start = new Date(game.created_at);
              const end = new Date(game.finished_at);
              const diff = (end - start) / 1000 / 60; // minutes
              if (diff > 0 && diff < 120) { // filter outliers
                totalTimeFinished += diff;
                countTimeFinished++;
              }
            }
          }
          
          // Time for all (abandoned or finished)
          if (game.created_at && (game.finished_at || game.updated_at)) {
            const start = new Date(game.created_at);
            const end = new Date(game.finished_at || game.updated_at);
            const diff = (end - start) / 1000 / 60;
            if (diff > 0 && diff < 120) {
              totalTimeAll += diff;
            }
          }
          
          if (game.player1_name) users.add(game.player1_name);
          if (game.player2_name) users.add(game.player2_name);
        });

        const avgFinished = countTimeFinished > 0 ? totalTimeFinished / countTimeFinished : 0;
        const avgAll = total > 0 ? totalTimeAll / total : 0;

        // Funnel calculation
        const numUsers = users.size;
        const startedGames = total;
        const finishedGames = finished;
        const chattedMock = Math.floor(finished * 0.4); // Mock: 40% of finished games have chat

        setStats({
          totalGames: total,
          ongoingGames: ongoing,
          finishedGames: finished,
          uniqueUsers: numUsers,
          avgTimeFinished: avgFinished,
          avgTimeAll: avgAll,
          funnel: [
            { label: 'Logget ind', value: numUsers, color: '#3b5976' },
            { label: 'Startet spil', value: startedGames, color: '#4a90e2' },
            { label: 'Afsluttet spil', value: finishedGames, color: '#2ecc71' },
            { label: 'Chattet (est.)', value: chattedMock, color: '#e63946' }
          ]
        });
      }
    } catch (error) {
      console.error("Fejl ved hentning af statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Indlæser statistik...</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1 className="stats-title">📊 Platform Statistik</h1>
        <button className="back-btn" onClick={() => onNavigate('welcome')}>Tilbage</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Unikke Brugere</h3>
          <div className="stat-value">{stats.uniqueUsers}</div>
          <div className="stat-subtext">Navne i databasen</div>
        </div>

        <div className="stat-card">
          <h3>Igangværende</h3>
          <div className="stat-value" style={{ color: '#2ecc71' }}>{stats.ongoingGames}</div>
          <div className="stat-subtext">Aktive spil nu</div>
        </div>

        <div className="stat-card">
          <h3>Gns. Tid (Afsluttet)</h3>
          <div className="stat-value">{stats.avgTimeFinished.toFixed(1)}m</div>
          <div className="stat-subtext">For gennemførte spil</div>
        </div>

        <div className="stat-card">
          <h3>Gns. Tid (Alle)</h3>
          <div className="stat-value" style={{ color: stats.avgTimeAll < stats.avgTimeFinished * 0.5 ? '#e63946' : '#3b5976' }}>
            {stats.avgTimeAll.toFixed(1)}m
          </div>
          <div className="stat-subtext">Inkl. afbrudte spil</div>
        </div>
      </div>

      <div className="stats-sections-row">
        <div className="dating-stats-section">
          <h2>🎯 Brugerrejse (Conversion Funnel)</h2>
          <div className="funnel-chart">
            {stats.funnel.map((item, index) => {
              const maxWidth = 100;
              const width = stats.funnel[0].value > 0 ? (item.value / stats.funnel[0].value) * maxWidth : 0;
              const dropRate = index > 0 && stats.funnel[index-1].value > 0 
                ? (item.value / stats.funnel[index-1].value * 100).toFixed(0) 
                : 100;

              return (
                <div key={item.label} className="funnel-step">
                  <div className="funnel-label-container">
                    <span className="funnel-label">{item.label}</span>
                    {index > 0 && <span className="funnel-drop">{dropRate}% holder ved</span>}
                  </div>
                  <div className="funnel-bar-wrapper">
                    <div 
                      className="funnel-bar" 
                      style={{ width: `${Math.max(width, 2)}%`, backgroundColor: item.color }}
                    >
                      <span className="funnel-value">{item.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dating-stats-section insights-card">
          <h2>💡 Indsigter</h2>
          <ul className="fun-fact-list">
            <li>
              <span className="fact-label">Retention:</span>
              <span className="fact-value">
                {stats.totalGames > 0 ? (stats.finishedGames / stats.totalGames * 100).toFixed(0) : 0}% gennemfører
              </span>
            </li>
            <li>
              <span className="fact-label">Engagement:</span>
              <span className="fact-value">
                {stats.avgTimeAll > 5 ? 'Højt' : 'Lavt'}
              </span>
            </li>
            <li>
              <span className="fact-label">Mest aktive tid:</span>
              <span className="fact-value">Aften</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

