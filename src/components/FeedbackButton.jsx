import React, { useState } from 'react';
import ReportService from '../services/ReportService';
import './FeedbackButton.css';

export default function FeedbackButton({ currentScreen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await ReportService.sendFeedback(currentScreen, message);
      setSent(true);
      setMessage('');
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      alert('Der skete en fejl. Prøv igen senere.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="feedback-fab" onClick={() => setIsOpen(true)} title="Rapportér fejl eller giv feedback">
        💬
      </div>

      {isOpen && (
        <div className="feedback-overlay">
          <div className="feedback-modal">
            <h3>Giv Feedback / Rapportér Fejl</h3>
            <p className="screen-info">Skærm: <code>{currentScreen}</code></p>
            
            {sent ? (
              <div className="success-msg">Tak for din feedback! 🙏</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea
                  placeholder="Beskriv fejlen eller din feedback her..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                  required
                />
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)} disabled={sending}>Annuller</button>
                  <button type="submit" className="btn-submit" disabled={sending}>
                    {sending ? 'Sender...' : 'Send Rapport'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
