import { useState, useEffect } from 'react';
import { fetchEvent, fetchRSVPs } from '../api/api';
import RSVPForm from './RSVPForm';
import ErrorBanner from './ErrorBanner';
import { formatDateIsoLocal } from '../utils/formatDate';

export default function EventDetail({ eventId, onBack }) {
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [error, setError] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function loadAll() {
    await Promise.all([loadEvent(), loadRsvps()]);
  }

  async function loadEvent() {
    try {
      setLoadingEvent(true);
      setError(null);
      const evt = await fetchEvent(eventId);
      setEvent(evt);
    } catch (e) {
      setError(e.message || 'Failed to load event');
    } finally {
      setLoadingEvent(false);
    }
  }

  async function loadRsvps() {
    try {
      setLoadingRsvps(true);
      const list = await fetchRSVPs(eventId);
      setRsvps(list);
    } catch (e) {
      setError(e.message || 'Failed to load RSVPs');
    } finally {
      setLoadingRsvps(false);
    }
  }

  function statusBgClass(status) {
    if (status === 'attending') return 'rsvp-attending';
    if (status === 'not attending') return 'rsvp-not-attending';
    if (status === 'maybe') return 'rsvp-maybe';
    return '';
  }

  if (!eventId) return <div>Select an event to view details.</div>;

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '12px' }}>
        ← Back to Home
      </button>
      {error && <ErrorBanner message={error} />}
      {loadingEvent || !event ? (
        <div>Loading event...</div>
      ) : (
        <>
          <div>
            <h1 style={{ color: '#3a7bd5', fontSize: '2rem', marginBottom: '6px' }}>{event.name}</h1>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div>
              <strong>Date:</strong> {formatDateIsoLocal(event.date)}
            </div>
            <div>
              <strong>Location:</strong> {event.location}
            </div>
            <div>
              <strong>Description:</strong> {event.description}
            </div>
            {event.organizer && (
              <div>
                <strong>Organizer:</strong> {event.organizer}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3>RSVPs</h3>
            {loadingRsvps ? (
              <div>Loading RSVPs...</div>
            ) : rsvps.length === 0 ? (
              <div>No RSVPs yet.</div>
            ) : (
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {rsvps.map(r => (
                  <li
                    key={r._id}
                    className={statusBgClass(r.rsvpStatus)}
                    style={{
                      marginBottom: '8px',
                      padding: '10px 14px',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <strong>{r.userName}:</strong> {r.rsvpStatus}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <div className="card" style={{ background: '#f9f9fb' }}>
              <h3 style={{ marginTop: 0 }}>Submit Your RSVP</h3>
              <RSVPForm eventId={eventId} onSuccess={loadRsvps} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
