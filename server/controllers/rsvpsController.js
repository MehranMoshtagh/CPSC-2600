const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

const VALID_STATUSES = ['attending', 'maybe', 'not attending'];

async function createRSVP(req, res, next) {
  try {
    const db = getDb();
    const { id: eventId } = req.params; // event ID in path
    let { userName, rsvpStatus } = req.body;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    if (!userName || !rsvpStatus) {
      return res.status(400).json({ error: 'userName and rsvpStatus are required' });
    }

    userName = String(userName).trim();
    rsvpStatus = String(rsvpStatus).trim().toLowerCase();

    if (!VALID_STATUSES.includes(rsvpStatus)) {
      return res.status(400).json({
        error: `rsvpStatus must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Check event exists
    const event = await db
      .collection('events')
      .findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const toInsert = {
      eventId: new ObjectId(eventId),
      userName,
      rsvpStatus,
      timestamp: new Date(),
    };

    const result = await db.collection('rsvps').insertOne(toInsert);
    const inserted = await db
      .collection('rsvps')
      .findOne({ _id: result.insertedId });
    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
}

async function getRSVPsForEvent(req, res, next) {
  try {
    const db = getDb();
    const { id: eventId } = req.params;
    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    // Optionally confirm event exists (could skip if performance is concern)
    const event = await db
      .collection('events')
      .findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const rsvps = await db
      .collection('rsvps')
      .find({ eventId: new ObjectId(eventId) })
      .toArray();
    res.json(rsvps);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRSVP,
  getRSVPsForEvent,
};
