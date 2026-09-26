export function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected operational failure occurred on the server.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
