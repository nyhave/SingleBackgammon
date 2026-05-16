import React, { useEffect, useState } from 'react';
import './StatsScreen.css';
import { supabase } from '../supabaseClient';
import ReportService from '../services/ReportService';

export default function StatsScreen({ onNavigate, onStartAIGame }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    ongoingGames: 0,
    finishedGames: 0,
    uniqueUsers: 0,
    avgTimeFinished: 0,
    avgTimeAll: 0,
    funnel: [],
    gameCounts: { backgammon: 0, connect4: 0 }
  });
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' or 'reports'
  const [showEvents, setShowEvents] = useState(false);
  const [toast, setToast] = useState(null); // { message, id }

  useEffect(() => {
    fetchStats();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await ReportService.getReports();
      setReports(data);
    } catch (err) {
      console.error("Fejl ved hentning af rapporter:", err);
    }
  };

  const showToast = (message) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 2500);
  };

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

        const startedGames = total;
        const finishedGames = finished;
        const chattedMock = Math.floor(finished * 0.4); // Mock: 40% of finished games have chat

        // Game type counts from events
        const { data: events } = await supabase
          .from('app_reports')
          .select('message')
          .eq('type', 'EVENT');
        
        const counts = { backgammon: 0, connect4: 0 };
        if (events) {
          events.forEach(e => {
            if (e.message.includes('backgammon')) counts.backgammon++;
            if (e.message.includes('connect4')) counts.connect4++;
          });
        }

        setStats({
          totalGames: total,
          ongoingGames: ongoing,
          finishedGames: finished,
          uniqueUsers: users.size,
          avgTimeFinished: avgFinished,
          avgTimeAll: avgAll,
          funnel: [
            { label: 'Unikke brugere', value: users.size, color: '#4a7096' },
            { label: 'Spil startet', value: startedGames, color: '#3b5976' },
            { label: 'Spil gennemført', value: finishedGames, color: '#2ecc71' },
            { label: 'Chat anvendt', value: chattedMock, color: '#d4a373' }
          ],
          gameCounts: counts
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
        <h1 className="stats-title">📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            style={{ backgroundColor: activeTab === 'stats' ? '#3b5976' : '#ddd', color: activeTab === 'stats' ? 'white' : '#333', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            STATISTIK
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
            style={{ backgroundColor: activeTab === 'reports' ? '#3b5976' : '#ddd', color: activeTab === 'reports' ? 'white' : '#333', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            FEJL & FEEDBACK ({reports.filter(r => r.status === 'new').length})
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="back-btn" 
            style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none' }}
            onClick={onStartAIGame}
          >
            🤖 TEST SPIL MOD AI
          </button>
          <button className="back-btn" onClick={() => onNavigate('welcome')}>Tilbage</button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <>
          {/* Game Comparison Section */}
      <div className="stats-grid" style={{ marginTop: '20px' }}>
        <div className="stats-card" style={{ flex: 1 }}>
          <h3>Spiltyper (Populæritet)</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', paddingTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#d4a373', width: '40px', height: `${Math.min(100, (stats.gameCounts.backgammon / (stats.gameCounts.backgammon + stats.gameCounts.connect4 || 1)) * 100)}px`, borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '10px', marginTop: '5px' }}>Backgammon</div>
              <div style={{ fontWeight: 'bold' }}>{stats.gameCounts.backgammon}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#3b5976', width: '40px', height: `${Math.min(100, (stats.gameCounts.connect4 / (stats.gameCounts.backgammon + stats.gameCounts.connect4 || 1)) * 100)}px`, borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '10px', marginTop: '5px' }}>4 på stribe</div>
              <div style={{ fontWeight: 'bold' }}>{stats.gameCounts.connect4}</div>
            </div>
          </div>
        </div>
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
        </>
      ) : (
        <div className="reports-section" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>🐞 Fejlrapporter & Feedback</h2>
            <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showEvents} 
                onChange={(e) => setShowEvents(e.target.checked)} 
              />
              Vis også statistik-events
            </label>
          </div>
          <div className="reports-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reports.filter(r => showEvents || r.type !== 'EVENT').length === 0 ? (
              <p>Ingen rapporter fundet.</p>
            ) : (
              reports
                .filter(r => showEvents || r.type !== 'EVENT')
                .map(report => (
                <div key={report.id} className="report-card" style={{ 
                  backgroundColor: 'white', 
                  padding: '15px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${report.type === 'error' ? '#e63946' : '#4a90e2'}`,
                  opacity: report.status === 'resolved' ? 0.6 : 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: report.type === 'error' ? '#e63946' : '#4a90e2' }}>
                      {report.type.toUpperCase()} ({report.screen})
                    </span>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {new Date(report.last_seen || report.created_at).toLocaleString('da-DK')}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '10px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                    {report.message}
                    {report.count > 1 && <span style={{ marginLeft: '10px', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>x{report.count}</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => {
                        const text = `TYPE: ${report.type}\nSKÆRM: ${report.screen}\nBESKED: ${report.message}\nSTACK: ${report.stack_trace || 'N/A'}`;
                        navigator.clipboard.writeText(text);
                        showToast('Kopieret til udklipsholder! 📋');
                      }}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', fontSize: '12px' }}
                    >
                      📋 Kopier
                    </button>
                    {report.status === 'new' && (
                      <button 
                        onClick={async () => {
                          await ReportService.updateStatus(report.id, 'resolved');
                          fetchReports();
                        }}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#2ecc71', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✅ Marker som løst
                      </button>
                    )}
                    <button 
                      onClick={async () => {
                        if(window.confirm('Er du sikker på du vil slette denne rapport?')) {
                          await ReportService.deleteReport(report.id);
                          fetchReports();
                        }
                      }}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#eee', color: '#666', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🗑️ Slet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {toast && (
        <div className="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  );
}

