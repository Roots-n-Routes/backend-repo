const mongoose = require('mongoose');

const PropertyTypeSchema = new mongoose.Schema({
  accomodation_type: { 
    type: String, 
    enum: ['resort'], 
    required: true 
    },
    no_of_units: { 
      type: String, 
      required: true 
    },
    currency: { 
      type: String, 
      enum: ['NGN', 'KSH', 'GH'], 
      required: true 
    },
});

module.exports = PropertyTypeSchema;
