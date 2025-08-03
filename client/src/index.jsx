import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import CreateEventForm from './components/CreateEventForm';
import './styles.css';

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const handleNewEvent = useCallback(() => {
    setRefreshKey(k => k + 1);
    setShowCreate(false);
  }, []);

  const handleBackToHome = () => {
    setSelectedId(null);
    setShowCreate(false);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <div className="header-bar">Event Management Application</div>

      {!selectedId && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0 }}>Upcoming Events</h2>
            </div>
            <div>
              <button className="btn" onClick={() => setShowCreate(true)}>
                Create New Event
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout-two-column">
        <div style={{ flex: '1 1 350px', minWidth: 300 }}>
          {showCreate && !selectedId && (
            <div className="card">
              <CreateEventForm onCreate={handleNewEvent} />
            </div>
          )}
          <div className="card">
            <EventList onSelect={id => { setSelectedId(id); setShowCreate(false); }} refreshKey={refreshKey} />
          </div>
        </div>

        <div style={{ flex: '1 1 500px', minWidth: 300 }}>
          {selectedId && (
            <div className="card">
              <EventDetail eventId={selectedId} onBack={handleBackToHome} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
