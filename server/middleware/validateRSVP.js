const VALID_STATUSES = ['attending', 'maybe', 'not attending'];

function validateRSVP(req, res, next) {
  let { userName, rsvpStatus } = req.body;

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

  // userName must not be purely numeric
  if (/^\d+$/.test(userName)) {
    return res.status(400).json({ error: 'userName must contain alphabetic characters, not just numbers' });
  }

  req.body.userName = userName;
  req.body.rsvpStatus = rsvpStatus;

  next();
}

module.exports = { validateRSVP };
