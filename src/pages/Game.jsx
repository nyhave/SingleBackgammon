import ChatPanel from '../components/ChatPanel.jsx';

export default function Game() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div style={{ flex: 1 }}>
        <h1>Game Board</h1>
      </div>
      <div style={{ width: '300px' }}>
        <ChatPanel />
      </div>
    </div>
  );
}

