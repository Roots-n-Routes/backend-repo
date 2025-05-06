const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  destination: {
    city: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: { type: [Number], index: '2dsphere'}, // [longitude, latitude]
  },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  availableUnits: {type: Number},
  pricePerNight: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  maxTravelers: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  amenities: [{ name: String, isPredefined: Boolean, description: String }], // e.g., ["WiFi", "Kitchen", "Pool"]
  images: [{ type: String}], // Array of image URLs
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  bookings: [
    {
      checkIn: Date,
      checkOut: Date,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Apartment', apartmentSchema);