const OrderServices = require('../Services/order_services')

const CreateOrder = async (req,res) => {
    const payload = req.body
    const vendorId = req.user._id
    console.log("req.user:", req.user);

    const CreateResponse = await OrderServices.CreateOrder({
        customerId:payload.customerId,
        vendorId:vendorId,
        productDetails:payload.productDetails
    })
    console.log("CreateOrder:", CreateResponse)
    res.status(CreateResponse.code).json(CreateResponse)
}

const GetAllOrder = async (req, res) => {
    const AllorderResponse = await OrderServices.GetAllOrders({});
    res.status(AllorderResponse.code).json(AllorderResponse);
};

const ConfirmDelivery = async (req, res) => {
    const { orderId } = req.body;
    const userId = req.user._id;

    const response = await OrderServices.confirmDelivery(orderId, userId);
    res.status(response.code).json(response);
};

module.exports = {CreateOrder,GetAllOrder,ConfirmDelivery}