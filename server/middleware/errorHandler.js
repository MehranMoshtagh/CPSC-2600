function errorHandler(err, req, res, next) {
  console.error('---ERROR START---');
  console.error(err);
  console.error(err.stack);
  console.error('---ERROR END---');

  if (err.code === 121 || err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Schema validation failed', details: err.message });
  }

  if (err.name === 'BSONTypeError' || err.name === 'TypeError') {
    return res.status(400).json({ error: 'Bad request', details: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
