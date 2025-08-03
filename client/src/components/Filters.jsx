import { useState, useEffect } from 'react';

export default function Filters({ onApply, initial = {} }) {
  const [name, setName] = useState(initial.name || '');
  const [location, setLocation] = useState(initial.location || '');
  const [date, setDate] = useState(initial.date || '');

  useEffect(() => {
    // Keep internal state in sync if parent changes initial
    setName(initial.name || '');
    setLocation(initial.location || '');
    setDate(initial.date || '');
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    onApply({ name, location, date });
  }

  function clearAll(e) {
    e.preventDefault();
    setName('');
    setLocation('');
    setDate('');
    onApply({ name: '', location: '', date: '' });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '12px',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ flex: '1 1 120px' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: 4 }}>Name</label>
        <input
          name="name"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-label="Filter by name"
          className="input-field"
        />
      </div>
      <div style={{ flex: '1 1 120px' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: 4 }}>Location</label>
        <input
          name="location"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          aria-label="Filter by location"
          className="input-field"
        />
      </div>
      <div style={{ flex: '1 1 120px' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: 4 }}>Date</label>
        <input
          name="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          aria-label="Filter by date"
          className="input-field"
        />
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button className="btn-sm" type="submit">
          Apply
        </button>
        <button className="btn-sm" onClick={clearAll} style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
          Clear
        </button>
      </div>
    </form>
  );
}
