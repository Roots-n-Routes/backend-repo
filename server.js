const express = require('express');
const passport = require('./Utils/Config/passport');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('tiny'));

// Route imports
const authRoutes = require('./Routes/authRoutes');
const vendorRoutes = require('./Routes/vendorRoutes');
const apartmentRoutes = require('./routes/apartmentRoute');
const searchRoutes = require('./routes/searchApartment');
const bookingRoutes = require('./routes/bookingRoute');
const reviewRoutes = require('./routes/reviewRoute');

// Use Routes
app.use('/auth', authRoutes);
app.use('/vendor', vendorRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/search', searchRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

module.exports = app;
