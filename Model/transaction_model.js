const { required } = require('joi')
const mongoose = require('mongoose')

const TransactionSchema = mongoose.Schema(
    {
        transactionId:{
           type:String,
           required:true,
           unique:true,
        },
        userEmail:{
           type:String,
           required:[true]
        },
        amount:{
            type:Number,
            required:[true]
        },
        orderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'orders'
        },
        vendorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'vendors'
        },
        currency:{
            type:String,
            default:"NGN",
            required:[true]
        },
        status:{
            type:String,
            enum:["pending_release","ready_for_release","released"],
            default:"pending_release",
        },
        flw_tx_ref:{
            type:String,
            required:[true]
        },
        flw_transfer_ref:{
            type:String,
            required:[false]
        },
        created_at:{
            type:Date,
            default:Date.now
        }
    }
)


const TransactionModel = mongoose.model("transactions",TransactionSchema)

module.exports = TransactionModel