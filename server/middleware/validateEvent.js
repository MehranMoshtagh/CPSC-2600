// Basic sanitization and required field checks for creating/updating events
function validateEvent(req, res, next) {
  let { name, date, location, description, organizer } = req.body;

  if (!name || !date || !location) {
    return res.status(400).json({ error: 'name, date, and location are required' });
  }

  // Trim and coerce
  name = String(name).trim();
  location = String(location).trim();
  if (description !== undefined) description = String(description).trim();
  if (organizer !== undefined) organizer = String(organizer).trim();

  // Name must not be purely numeric
  if (/^\d+$/.test(name)) {
    return res.status(400).json({ error: 'name must contain alphabetic characters, not just numbers' });
  }

  // Date parsing
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: 'date must be a valid date string' });
  }

  // Must be in the future (allow slight leeway of 1 second)
  const now = new Date();
  if (parsedDate.getTime() <= now.getTime()) {
    return res.status(400).json({ error: 'date must be in the future' });
  }

  // Attach cleaned values back
  req.body.name = name;
  req.body.location = location;
  req.body.date = parsedDate;
  req.body.description = description || '';
  req.body.organizer = organizer || '';

  next();
}

module.exports = { validateEvent };
