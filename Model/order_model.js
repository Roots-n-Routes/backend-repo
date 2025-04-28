const { required } = require('joi')
const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema(
    {
        customerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users',
            required:[true,"Customer ID is required"]
        },
        vendorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'vendors'
        },
        productDetails:{
            type:String,
            required:[true,"Please state what you are ordering"]
        },
        status:{
            type:String,
            enum:["pending","shipped","delivered","confirmed"],
            default:"pending",
            required:[true]
        },
        created_at:{
            type:Date
        }
    }
)

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel