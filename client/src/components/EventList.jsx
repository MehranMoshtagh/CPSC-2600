import { useState, useEffect } from 'react';
import { fetchEvents } from '../api/api';
import Filters from './Filters';
import ErrorBanner from './ErrorBanner';
import { formatDateIsoLocal } from '../utils/formatDate';

export default function EventList({ onSelect, refreshKey }) {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ name: '', location: '', date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(filters);
      if (!Array.isArray(data)) {
        console.warn('Expected events array but got:', data);
        setEvents([]);
        setError('Unexpected response from server');
      } else {
        setEvents(data);
      }
    } catch (e) {
      setError(e.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(f) {
    setFilters(f);
    // fetch with updated filters
    setTimeout(load, 0);
  }

  function clearFilters() {
    setFilters({ name: '', location: '', date: '' });
    setTimeout(load, 0);
  }

  return (
    <div>
      <Filters onApply={applyFilters} initial={filters} />
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <div>Loading events...</div>
      ) : (
        <>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {events.length === 0 && <li>No events found.</li>}
            {events.map(e => (
              <li key={e._id} style={{ marginBottom: '8px' }}>
                <div className="card" style={{ padding: '12px 16px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => onSelect(e._id)}
                  >
                    <div className="event-title" style={{ marginBottom: '6px' }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div>
                        <strong>Date:</strong> {formatDateIsoLocal(e.date)}
                      </div>
                      <div>
                        <strong>Location:</strong> {e.location}
                      </div>
                      <div>
                        <strong>Description:</strong> {e.description}
                      </div>
                    </div>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn-sm" onClick={load}>
              Refresh
            </button>
            <button className="btn-sm" onClick={clearFilters} style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
              Clear Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
