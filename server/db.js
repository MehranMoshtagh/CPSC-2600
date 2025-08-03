const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in environment');
  const client = new MongoClient(uri, { wtimeoutMS: 2500 });
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'eventsdb');

  await applySchemas(); // ensure validation rules are applied

  console.log('✅ Connected to MongoDB');
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call connectToDb first.');
  return db;
}

async function applySchemas() {
  const eventSchema = require('./schemas/eventSchema');
  const rsvpSchema = require('./schemas/rsvpSchema');

  try {
    await db.command({
      collMod: 'events',
      validator: { $jsonSchema: eventSchema },
      validationLevel: 'moderate',
    });
  } catch (e) {
    if (e.codeName === 'NamespaceNotFound' || /NamespaceNotFound/.test(e.message)) {
      await db.createCollection('events', {
        validator: { $jsonSchema: eventSchema },
      });
    } else {
      console.warn('Warning applying schema to events collection:', e.message);
    }
  }

  try {
    await db.command({
      collMod: 'rsvps',
      validator: { $jsonSchema: rsvpSchema },
      validationLevel: 'moderate',
    });
  } catch (e) {
    if (e.codeName === 'NamespaceNotFound' || /NamespaceNotFound/.test(e.message)) {
      await db.createCollection('rsvps', {
        validator: { $jsonSchema: rsvpSchema },
      });
    } else {
      console.warn('Warning applying schema to rsvps collection:', e.message);
    }
  }

  await db.collection('rsvps').createIndex({ eventId: 1 });
}

module.exports = { connectToDb, getDb };
