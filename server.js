// Import core packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); // HTTP request logger

// Import local modules
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// --- 1. GLOBAL MIDDLEWARE ---

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser: Reads data from body into req.body
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- 2. DATABASE CONNECTION ---
const DB = process.env.MONGO_URI;
mongoose.connect(DB, {
  // These are no longer needed
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- 3. API ROUTES ---
// Import route handlers
const providerRoutes = require('./routes/providerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount the routers
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// --- 4. ERROR HANDLING ---

// Catch all unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware-this MUST be the last middleware
app.use(globalErrorHandler);

// --- 5. START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

