const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  apartment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Apartment', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  comment: { 
    type: String,
    required:true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);