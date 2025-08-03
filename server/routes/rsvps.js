const express = require('express');
const router = express.Router();
const {
  createRSVP,
  getRSVPsForEvent,
} = require('../controllers/rsvpsController');
const { validateRSVP } = require('../middleware/validateRSVP');

// POST /api/v1/events/:id/rsvp
router.post('/:id/rsvp', validateRSVP, createRSVP);

// GET /api/v1/events/:id/rsvps
router.get('/:id/rsvps', getRSVPsForEvent);

module.exports = router;
