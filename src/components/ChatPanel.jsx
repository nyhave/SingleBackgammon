import { useEffect, useRef, useState } from 'react';

const prompts = [
  "What move are you considering next?",
  "Have you spotted any risky positions?",
  "What's your favorite backgammon strategy?",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [usedPrompts, setUsedPrompts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('promptHistory')) || [];
    } catch {
      return [];
    }
  });
  const wsRef = useRef(null);
  const lastMessageTimeRef = useRef(Date.now());
  const lastWasPromptRef = useRef(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.addEventListener('message', (event) => {
      setMessages((prev) => [...prev, { text: event.data, system: false }]);
      lastMessageTimeRef.current = Date.now();
      lastWasPromptRef.current = false;
    });

    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        Date.now() - lastMessageTimeRef.current > 5 * 60 * 1000 &&
        !lastWasPromptRef.current
      ) {
        injectPrompt();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [usedPrompts]);

  const injectPrompt = () => {
    const available = prompts.filter((p) => !usedPrompts.includes(p));
    if (available.length === 0) {
      setUsedPrompts([]);
      localStorage.removeItem('promptHistory');
      return;
    }
    const prompt = available[Math.floor(Math.random() * available.length)];
    setMessages((prev) => [...prev, { text: prompt, system: true }]);
    const newHistory = [...usedPrompts, prompt];
    setUsedPrompts(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
    lastMessageTimeRef.current = Date.now();
    lastWasPromptRef.current = true;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (wsRef.current) wsRef.current.send(input);
    setMessages((prev) => [...prev, { text: input, system: false }]);
    setInput('');
    lastMessageTimeRef.current = Date.now();
    lastWasPromptRef.current = false;
  };

  return (
    <div className="chat-panel">
      <div className="messages" style={{ height: '200px', overflowY: 'auto' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ color: m.system ? '#666' : '#000' }}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="input" style={{ marginTop: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

