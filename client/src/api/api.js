const API_BASE = 'http://localhost:3000/api/v1'; // ← explicit backend origin


async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'Request failed');
    err.details = body;
    throw err;
  }
  return body;
}

export function fetchEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);
  if (filters.location) params.append('location', filters.location);
  if (filters.date) params.append('date', filters.date);
  return request(`/events?${params.toString()}`);
}

export function fetchEvent(id) {
  return request(`/events/${id}`);
}

export function createEvent(data) {
  return request('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function postRSVP(eventId, rsvp) {
  return request(`/events/${eventId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify(rsvp),
  });
}

export function fetchRSVPs(eventId) {
  return request(`/events/${eventId}/rsvps`);
}
