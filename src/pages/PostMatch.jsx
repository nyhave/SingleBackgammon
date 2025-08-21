import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PostMatch() {
  useEffect(() => {
    console.log('PostMatch page component mounted');
  }, []);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    try {
      setSummary(JSON.parse(localStorage.getItem('matchSummary')));
    } catch {
      setSummary(null);
    }
  }, []);

  if (!summary) {
    return <p>No match summary available.</p>;
  }

  return (
    <div>
      <h1>Post Match Summary</h1>
      <p>Score: {summary.score}</p>
      <div>
        <label>
          Chemistry
          <progress value={summary.chemistry} max="100" style={{ marginLeft: '0.5rem' }} />
        </label>
      </div>
      {summary.roomId && (
        <p>
          <Link to={`/game?room=${summary.roomId}`}>Continue Conversation</Link>
        </p>
      )}
    </div>
  );
}
