import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
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
    return () => socket.close();
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
      {status === 'waiting' ? (
        <p>Waiting for an opponent...</p>
      ) : (
        <button onClick={joinLobby}>Find Match</button>
      )}
    </div>
  );
}
