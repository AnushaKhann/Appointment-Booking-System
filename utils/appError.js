// This class creates custom, operational errors we can throw.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor (Error) with the message

    this.statusCode = statusCode;
    // 'fail' for 4xx errors, 'error' for 5xx errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark as a trusted error, not a bug

    // Capture the stack trace, excluding this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

