import { useState } from 'react';
import { createEvent } from '../api/api';
import ErrorBanner from './ErrorBanner';

export default function CreateEventForm({ onCreate }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(''); // yyyy-mm-dd
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name || !location || !date) {
      setError('Name, location, and date are required.');
      return;
    }

    const isoDate = new Date(date);
    if (isNaN(isoDate)) {
      setError('Invalid date.');
      return;
    }

    try {
      setSubmitting(true);
      await createEvent({
        name: name.trim(),
        location: location.trim(),
        date: isoDate.toISOString(),
        description: description.trim(),
        organizer: organizer.trim(),
      });
      setName('');
      setLocation('');
      setDate('');
      setDescription('');
      setOrganizer('');
      if (onCreate) onCreate();
    } catch (e) {
      setError(e.details?.error || e.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ margin: '6px 0' }}>Create New Event</h2>
        <div className="small-muted">
          Fields marked with <span style={{ color: 'red' }}>*</span> are mandatory
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label>
            Name <span style={{ color: 'red' }}>*</span>:<br />
            <input
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:<br />
            <textarea
              className="input-field"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </label>
        </div>
        <div>
          <label>
            Date <span style={{ color: 'red' }}>*</span>:<br />
            <input
              className="input-field"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location <span style={{ color: 'red' }}>*</span>:<br />
            <input
              className="input-field"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Organizer:<br />
            <input
              className="input-field"
              value={organizer}
              onChange={e => setOrganizer(e.target.value)}
            />
          </label>
        </div>
        {error && <ErrorBanner message={error} />}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
