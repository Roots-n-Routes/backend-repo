const mongoose = require('mongoose')

const AmenitiesSchema = new mongoose.Schema({
    amenities:{
      wifiPresent:{
        type:Boolean,
        default:false
      },
      parking:{
        type:Boolean,
        default:false,
      },
      general_amenities:{
        guestPoolAccess:{
          type:Boolean,
          default:false
        },
        elevators:{
          type:Boolean,
          default:false
        },
        electricity:{
          type:Boolean,
          default:false
        },
        security:{
          type:Boolean,
          default:false
        },
        safety_items:{
          type:Boolean,
          default:false
        },
        pets:{
          type:Boolean,
          default:false
        }
      },
      accessibility_options:{
        accessibilty_offerings:{
          type:Boolean,
          default:false
        },
        serviceAnimals:{
          type:Boolean,
          default:false
        }
      },
      unique_amenities:{
        type:Boolean,
        default:false
      }
  },
})

module.exports = AmenitiesSchema;