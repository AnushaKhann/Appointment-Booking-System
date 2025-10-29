// This utility wraps your async controller functions
// It catches any errors and passes them to your global error handler
module.exports = fn => {
  // Return a new function that takes req, res, and next
  return (req, res, next) => {
    // Call the original function, but add .catch()
    // If it rejects, the error is passed to next()
    fn(req, res, next).catch(next);
  };
};

