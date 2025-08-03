const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
} = require('../controllers/eventsController');
const { validateEvent } = require('../middleware/validateEvent');

// GET /api/v1/events?name=&location=&date=
router.get('/', getEvents);

// GET /api/v1/events/:id
router.get('/:id', getEventById);

// POST /api/v1/events
router.post('/', validateEvent, createEvent);

module.exports = router;
