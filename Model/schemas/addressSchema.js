const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  country: { 
    type: String,
    required: false
    },
  street_address: { 
    type: String, 
    required: false 
    },
  unit_number: { 
    type: String, 
    required: false 
    },
  city: { 
    type: String, 
    required: false 
    },
  state: { 
    type: String, 
    required: false 
    },
  zip_code: { 
    type: String, 
    required: false
    },
});

module.exports = AddressSchema;
