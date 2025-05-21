const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name_of_property: {
    type: String,
    required: true
  },
  property_address: {
    country: { 
      type: String, 
      required: true 
    },
    street_address: { 
      type: String, 
      required: true 
    },
    unit_number: { 
      type: String, 
      required:true
    },
    city:{
      type:String,
      required:true,
    },
    state:{
      type:String,
      required:true
    },
    zip_code:{
      type:String,
      required:true
    }
  },
  property_type:{
    accomodation_type:{
      type:String,
      enum:['resort'],
      required:true
    },
    no_of_units:{
      type:String,
      required:true
    },
    currency:{
      type:String,
      enum:['NGN','KSH','GH'],
      required:true
    }
  },
  spoken_language:{
    type:String,
    enum:['English','French','Igbo','Yoruba','Hausa','Portugese','Arabic','Tamil','Japanese','Xhosa','Italian','Spanish','Hindi','Korean','Pidgin','Amharic','Chinese','Swahili','Zulu','Afrikaans','Dutch'],
    required:true
  },
  property_category:{
    type:String,
    enum:['Adults only','Party friendly','Family friendly','Children friendly','Business friendly','Pet friendly'],
    required:true
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  availableUnits: {
    type: Number
  },
  pricePerNight: { 
    type: Number, 
    required: true 
  },
  bedrooms: { 
    type: Number, 
    required: true 
  },
  bathrooms: { 
    type: Number, 
    required: true 
  },
  maxTravelers: { 
    type: Number, 
    required: true 
  },
  maxGuests: { 
    type: Number, 
    required: true 
  },
  amenities: { 
    type: Array, 
    required: true 
  },
  images: { 
    type: String,
    default:null,
    required:false
  }, // Array of image URLs
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isAvailable: { 
    type: Boolean,
     default: true 
  },
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