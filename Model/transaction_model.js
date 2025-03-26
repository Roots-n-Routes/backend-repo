const mongoose = require('mongoose')

const TransactionSchema = mongoose.Schema(
    {
        transactionId:{
           type:String,
           required:[true]
        },
        userEmail:{
           type:String,
           required:[true]
        },
        amount:{
            type:Number,
            required:[true]
        },
        currency:{
            type:String,
            required:[true]
        },
        status:{
            type:String,
            enum:["pending","successful","failed"],
            default:"pending",
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }
)


const TransactionModel = mongoose.model("transactions",TransactionSchema)

module.exports = TransactionModel