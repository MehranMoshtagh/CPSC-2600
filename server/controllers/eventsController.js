const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

async function getEvents(req, res, next) {
  try {
    const db = getDb();
    const filter = {};

    if (req.query.name) {
      filter.name = { $regex: String(req.query.name).trim(), $options: 'i' };
    }
    if (req.query.location) {
      filter.location = { $regex: String(req.query.location).trim(), $options: 'i' };
    }
    if (req.query.date) {
      const d = new Date(req.query.date);
      if (!isNaN(d)) {
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);
        filter.date = { $gte: d, $lt: nextDay };
      }
    }

    const events = await db.collection('events').find(filter).toArray();
    res.json(events);
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const db = getDb();
    let { name, date, location, description, organizer } = req.body;

    // Controller-level fallback validation (middleware should catch most)
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'name, date, and location are required' });
    }

    name = String(name).trim();
    location = String(location).trim();
    if (description !== undefined) description = String(description).trim();
    if (organizer !== undefined) organizer = String(organizer).trim();

    // Name not purely numeric
    if (/^\d+$/.test(name)) {
      return res.status(400).json({ error: 'name must contain alphabetic characters, not just numbers' });
    }

    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'date must be a valid ISO date string' });
    }

    // Future date enforcement
    const now = new Date();
    if (parsedDate.getTime() <= now.getTime()) {
      return res.status(400).json({ error: 'date must be in the future' });
    }

    const toInsert = {
      name,
      location,
      date: parsedDate,
      description: description || '',
      organizer: organizer || '',
      createdAt: new Date(),
    };

    console.log('Creating event with payload:', toInsert);

    const result = await db.collection('events').insertOne(toInsert);
    const inserted = await db
      .collection('events')
      .findOne({ _id: result.insertedId });
    res.status(201).json(inserted);
  } catch (err) {
    console.error('Error in createEvent controller:', err);
    if (err.code === 121 && err.errInfo?.details?.schemaRulesNotSatisfied) {
      console.error(
        'Schema failures:',
        JSON.stringify(err.errInfo.details.schemaRulesNotSatisfied, null, 2)
      );
    }
    next(err);
  }
}


module.exports = {
  getEvents,
  getEventById,
  createEvent,
};
