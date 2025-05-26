const mongoose = require('mongoose')

const RoomandRatesSchema = new mongoose.Schema({
    unit_type:{
      type:String,
      enum:['Chalet'],
      default:'Chalet'
    },
    unit_class:{
      type:String,
      enum:['Executive'],
      default:'Executive'
    },
    max_occupany:{
      type:Number,
      default:4
    },
    no_of_bedrooms:{
      type:Number,
      default:2
    },
    bedroom:{
      bedroom_type:{
        type:String,
        enum:['Master Twin Room', 'Guest Room']
      },
      bedType:{
        type:String,
        enum:['Double bed(4.5*6.25ft)']
      },
      howMany:{
        type:Number,
        default:1
      },
    },
    bathrooms:{
      no_of_bathrooms:{
        type:Number,
        default:1
      },
      bathroom_type:{
        type:String,
        enum:['Private Bathroom']
      },
      bath_or_shower:{
        type:String,
        enum:['Both','Shower','Bath'],
      }
    },
    unitAmenities:{
      kitchen:{
        type:Boolean,
        default:false
      },
      climate_control:{
        type:String,
        enum:['Air conditioning','Heating'],
        default:'Air conditioning'
      },
      unit_view:{
        type:Boolean,
        default:false
      },
      outdoor_space:{
        type:Boolean,
        default:false
      },
      living_room:{
        type:Boolean,
        default:false
      },
      room_conveninces:{
        type:Boolean,
        enum:['Smoking Conveniences','Laundry Facilities','Stay/Room','Games']
      },
      other_amenities:{
        type:String,
        enum:[
          'Electrical chargers and adapters',
          'Heating',
          'Dining table',
          'Couch sofa',
          'Centre Table',
          'Entryway set up',
          'Tv and Sound System',
          'Smart Control',
        ]
      },
      rate_setup:{
        pricingModel:{
          type:Boolean,
          enum:['Per-day','Per month', 'Per year'],
          default:'Per-day'
        },
        base_amount:{
          type:Number
        },
        breakfast_included:{
          type:Boolean,
          default:false,
        },
        reservations:{
          type:Boolean,
          default:false
        },
        discount:{
          type:Boolean,
          default:false
        },
        caution_deposit:{
          type:Boolean,
          default:false
        },
        bundle_packages:{
          type:Boolean,
          default:false
        }
      }
    },
    taxInformation:{
        choose_remittance:{
          type:Boolean,
          default:false
        },
        choose_tax:{
          type:Boolean,
          enum:['7.50% VAT (Value Added Tax)', '0.75% VAT on Service Fee', '10.00% Service fee'],
          default:false,
        },
        commissions:{
          serviceFee:{
            type:Number,
          }
        },
    },
    photos:{
        cover_photos:{
            type:String,
            default:null,
            required:false
        },
        upload_exterior_or_interior:{
            type:String,
            default:null,
            required:false
        },
        amenities_photo:{
            type:String,
            default:null,
            required:false
        },
        room_photo:{
            type:String,
            default:null,
            required:false
        }
    },
    cancellation_window:{
        type:Boolean,
        default:false
    }, 
})

module.exports = RoomandRatesSchema;