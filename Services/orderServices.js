const OrderModel = require('../Model/order_model')
const TransactionModel = require("../Model/transaction_model");

const CreateOrder = async ({customerId,vendorId,productDetails}) => {
    try {
        const newOrder = await OrderModel.create({
            customerId,vendorId,productDetails,
            created_at: new Date()
        });
        console.log("Order Created:", newOrder)
        return{
            code:201,
            success:true,
            message:"Order created successfully",
            data:{order:newOrder}
        }
    } catch (error) {
        return{
            code:500,
            success:false,
            data:null,
            message:error.message
        }
    }
}
const GetAllOrders = async () => {
    try {
        const orders = await OrderModel.find({}).populate('customerId vendorId');
        if (!orders.length === 0) {
            return {
                code: 404,
                success: false,
                message: "No Orders available",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Orders available",
            data: { orders }
        };
    } catch (error) {
        return {
            code: 500,
            success: false,
            message: error.message,
        };
    }
};

const confirmDelivery = async(orderId,userId) =>{
    try {
          const order = await OrderModel.findById(orderId);
          console.log("Cheking order:",order)
          if (!order) {
            return{
                code:404,
                success:false,
                message:"Order not found"
            }
          } 

          if (order.vendorId.toString() !== userId.toString()) {
            return{
                code:403,
                success:false,
                message:"You are not authorized"
            }
          }
           //update order status
           order.status = "confirmed";
           await order.save();

           const transaction = await TransactionModel.findOne({orderId:order._id});
           if (!transaction){ 
                return{
                    code:404,
                    success:false,
                    message:"Transaction not found"
                }
            }
           transaction.status = "ready_for_release";
           await transaction.save();

           //await releaseFundsToVendor(transaction)

           return{
                code:200,
                success:true,
                message:"Order confirmed. Payment ready to be released",
                data:{order,transaction}
           }
    } catch (error) {
        return{
            code:500,
            success:false,
            message:error.message
        }
    }
}


module.exports = {CreateOrder,GetAllOrders,confirmDelivery}