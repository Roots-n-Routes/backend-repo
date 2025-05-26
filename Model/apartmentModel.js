const mongoose = require('mongoose');
const AddressSchema = require('./schemas/addressSchema');
const PropertySchema = require('./schemas/propertySchema')
const CheckInOptions = require('./schemas/checkInOptionsSchema')
const CheckOutOptions = require('./schemas/checkInOptionsSchema')
const Amenities = require('./schemas/amenitiesSchema')
const RoomandRates = require('./schemas/roomAndRatesSchema')

const apartmentSchema = new mongoose.Schema({
  name_of_Property: {
    type: String,
    required: true
  },
  property_address:AddressSchema,
  property_type:PropertySchema,
  spoken_language:{
    type:Boolean,
    default:false,
    required:true
  },
  property_category:{
    type:Boolean,
    default:false,
    required:true
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled'], 
    default: 'pending',
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  check_in_options:CheckInOptions,
  check_out_options:CheckOutOptions,
  amenities:Amenities,
  room_and_rates:RoomandRates,
  images: { 
    type: String,
    default:null,
    required:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model('Apartment', apartmentSchema);