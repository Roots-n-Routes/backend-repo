const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  destination: {
    city: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: { type: [Number], index: '2dsphere',required:false}, // [longitude, latitude]
  },
  availableUnits: {type: Number},
  pricePerNight: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  maxTravelers: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  amenities: [{ type: String,required:false }], // e.g., ["WiFi", "Kitchen", "Pool"]
  images: [{ type: String,required:false}], // Array of image URLs
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