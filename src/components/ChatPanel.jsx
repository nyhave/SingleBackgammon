import { useState, useEffect, useRef } from 'react';

console.log('ChatPanel.jsx module loaded');

const PROMPTS = [
  "What's your strategy for the next move?",
  "That was a bold roll! How do you feel?",
  "Seen any memorable games lately?",
  "Do you prefer aggressive or defensive play?"
];

export default function ChatPanel({ roomId, onInteraction = () => {} }) {
  useEffect(() => {
    console.log('ChatPanel component mounted');
  }, []);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const lastMessageTimeRef = useRef(Date.now());
  const [lastWasPrompt, setLastWasPrompt] = useState(false);
  const [promptHistory, setPromptHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('promptHistory')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let socket;
    try {
      socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () => {
        if (roomId) {
          socket.send(JSON.stringify({ type: 'join-room', roomId }));
        }
      };
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat') {
            setMessages((msgs) => [...msgs, { from: 'them', text: data.text }]);
            lastMessageTimeRef.current = Date.now();
            setLastWasPrompt(false);
            onInteraction();
          } else if (data.type === 'system') {
            setMessages((msgs) => [...msgs, { from: 'system', text: data.text }]);
          }
        } catch {
          // ignore malformed messages
        }
      };
      setWs(socket);
    } catch (err) {
      console.error('Failed to connect to chat server', err);
      setMessages((msgs) => [...msgs, { from: 'system', text: 'Chat unavailable' }]);
    }
    return () => socket?.close();
  }, [roomId, onInteraction]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMessageTimeRef.current > 5 * 60 * 1000 && !lastWasPrompt) {
        injectPrompt();
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [lastWasPrompt, promptHistory]);

  const injectPrompt = () => {
    const unused = PROMPTS.filter((p) => !promptHistory.includes(p));
    if (unused.length === 0) return;
    const prompt = unused[Math.floor(Math.random() * unused.length)];
    setMessages((msgs) => [...msgs, { from: 'system', text: prompt }]);
    setPromptHistory((history) => {
      const updated = [...history, prompt];
      localStorage.setItem('promptHistory', JSON.stringify(updated));
      return updated;
    });
    lastMessageTimeRef.current = Date.now();
    setLastWasPrompt(true);
  };

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(
        JSON.stringify({ type: 'chat', roomId, text: input.trim() })
      );
      setMessages((msgs) => [...msgs, { from: 'me', text: input.trim() }]);
      setInput('');
      lastMessageTimeRef.current = Date.now();
      setLastWasPrompt(false);
      onInteraction();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-panel" style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
      <div className="messages" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`} style={{ marginBottom: '0.5rem' }}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="input" style={{ display: 'flex', marginTop: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={{ flex: 1 }}
          disabled={!ws}
        />
        <button onClick={sendMessage} disabled={!ws}>
          Send
        </button>
      </div>
    </div>
  );
}

