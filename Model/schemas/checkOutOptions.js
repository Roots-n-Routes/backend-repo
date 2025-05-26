const mongoose = require('mongoose')

const CheckOutOptionsSchema = new mongoose.Schema({
    checkoutOptions:{
      checkout_time:{
        type:String,
        enum:['Noon']
      },
      extend_guest_stay:{
        type:Boolean,
        default:false,
      },
      extension_notice_time:{
        type:String,
        enum:['noon'],
        default:'noon'
      },
      extension_approval_effect:{
        type:String,
        enum:['On Payment to host']
      }
  },
})

module.exports = CheckOutOptionsSchema;