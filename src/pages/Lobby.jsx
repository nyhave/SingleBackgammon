import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  useEffect(() => {
    console.log('Lobby page component mounted');
  }, []);
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let socket;
    try {
      socket = new WebSocket('ws://localhost:8080');
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'match') {
            navigate(`/game?room=${data.roomId}`);
          }
        } catch {
          // ignore
        }
      };
      setWs(socket);
    } catch (err) {
      console.error('Failed to connect to lobby server', err);
      setError(true);
    }
    return () => socket?.close();
  }, [navigate]);

  const joinLobby = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'join-lobby' }));
      setStatus('waiting');
    }
  };

  return (
    <div>
      <h1>Lobby</h1>
      {error ? (
        <p>Lobby server unavailable.</p>
      ) : status === 'waiting' ? (
        <p>Waiting for an opponent...</p>
      ) : (
        <button onClick={joinLobby} disabled={!ws}>Find Match</button>
      )}
    </div>
  );
}
