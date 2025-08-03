import { useState } from 'react';
import { postRSVP } from '../api/api';
import ErrorBanner from './ErrorBanner';

export default function RSVPForm({ eventId, onSuccess }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('attending');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!name) {
      setError('Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      await postRSVP(eventId, {
        userName: name.trim(),
        rsvpStatus: status,
      });
      setName('');
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.details?.error || e.message || 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '12px' }}>
      <div>
        <label>
          Your Name:<br />
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          RSVP Status:<br />
          <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="attending">Attending</option>
            <option value="maybe">Maybe</option>
            <option value="not attending">Not attending</option>
          </select>
        </label>
      </div>
      {error && <ErrorBanner message={error} />}
      <div>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  );
}
