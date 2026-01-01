import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  // Log unexpected errors
  if (!err.isOperational) {
    logger.error({ err }, 'Unexpected error');
  }

  return res.status(statusCode).json({ status, statusCode, message });
};

export default errorHandler;