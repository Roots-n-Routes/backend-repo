const Transaction = require('../Model/transaction_model')
const OrderModel = require('../Model/order_model')
const axios = require('axios');
const {v4:uuidv4} = require('uuid');
const VendorModel = require('../Model/vendor_model');
require('dotenv').config()

const headers = {
        Authorization:`Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type":"application/json",
};

const InitiatePayment = async (req,res) => {
    try {
        const {amount,currency,orderId,email} = req.body
        const vendorId = req.user._id;
        const transactionId = `tx-${Date.now()}-${uuidv4()}`;

        //validate order
        const order = await OrderModel.findById(orderId).populate('customerId');
        console.log("Populated order:", order);

        if(!order){
            return res.status(404).json({error:'Order not found'});
        }

        if(order.vendorId.toString() !== vendorId.toString()){
            return res.status(403).json({error: 'Customer email not found in order'})
        }

        // const customerEmail = order.customerId.email;

        // if (!customerEmail) {
        //     return res.status(400).json({error:"Customer email not found in order"})
        // }

        //Save transaction
        const transaction = new Transaction({
            transactionId,
            userEmail:email,
            amount:amount,
            currency:currency,
            orderId:orderId,
            vendorId:vendorId,
            flw_tx_ref:transactionId,
            status:"pending_release" 
        })
        await transaction.save()

        const paymentData = {
            tx_ref:transactionId,
            amount,
            currency: currency || 'NGN',
            redirect_url:'https://308e-102-90-102-204.ngrok-free.app/success', //F.E will give a link it should return after successful payment
            customer:{
                email
            },
            customizations:{
                title:"Roots and Routes",
                description:"Payment held until delivery confirmation",
                logo:"roots and routes website link"
            },
        };

        const response = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            paymentData,
            { headers }
        );
        return res.status(200).json(
            { 
            message:"Payment Initiated",  
            payment_link: response.data.data.link, 
            transaction
        });
    } catch (error) {
        console.error("Initiate Payment Error:", error?.response?.data || error.message);
        return res.status(500).json({error:error.message});
    }
}
const verifyTransaction = async (req, res) => {
    try {
        const { transaction_id } = req.query;

        if (!transaction_id) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        // Verify transaction
        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            { headers}
        );

        const data = response.data.data;

        if (response.data.status !== 'success' || data.status !== "successful") {
            return res.status(400).json({error:"Transaction not successful"});
        }

        const transaction = await Transaction.findOne({flw_tx_ref:data.tx_ref});
        
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found in database" });
        }

        if (!transaction.status !== "pending_release") {
            return res.status(400).json({error:"Transaction already verified or released"})
        }

        //update to 'ready_for_release
        transaction.status = "ready_for_release";
        await transaction.save();

        return res.status(200).json({ 
            message: "Transaction verified and ready for release",
            transaction 
        });
    } catch (error) {
        console.error("Flutterwave Error:", error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || error.message });
    }
};

const createBeneficiary = async (vendor) => {
    const beneficiaryPayload = {
        account_bank:vendor.bankCode,
        account_number:vendor.account_number,
        beneficiary_name:vendor.name,
        amount:tx.amount,
        currency:"NGN",
        bank_name:"ACCESS BANK NIG",
    };

    const beneficiaryResponse = await axios.post(
        "https://api.flutterwave.com/v3/beneficiaries",
        beneficiaryPayload,
        { headers }
    )
    return beneficiaryResponse.data.data;
}

const InitiateTransfer = async (vendor, amount, reference) => {
    const payload = {
        account_bank: vendor.bankCode,
        account_number: vendor.account_number,
        amount,
        currency: "NGN",
        reference,
        narration: "Escrow payout",
        callback_url: "https://308e-102-90-102-204.ngrok-free.app/transfer-callback", // Optional
        debit_currency: "NGN"
    };

    const response = await axios.post(
        "https://api.flutterwave.com/v3/transfers",
        payload,
        { headers }
    );

    return response.data.data;
};

const ReleaseFunds = async (req, res) => {
    try {
        const { orderId } = req.body;

        const tx = await Transaction.findOne({ orderId });
        if (!tx || tx.status !== "ready_for_release") {
            return res.status(400).json({ error: "Transaction not ready for release" });
        }

        const vendor = await VendorModel.findById(tx.vendorId);
        if (!vendor || !vendor.bankCode || !vendor.account_number) {
            return res.status(400).json({ error: "Vendor bank details missing" });
        }

        const reference = `escrow-${Date.now()}`;
        const transfer = await InitiateTransfer(vendor, tx.amount, reference);

        tx.status = "released";
        tx.flw_transfer_ref = transfer.reference;
        tx.flw_transfer_id = transfer.id;
        tx.transfer_response = transfer;
        await tx.save();

        res.json({ message: "Funds released to vendor", transfer });
    } catch (error) {
        console.error("Release Funds Error:", error?.response?.data || error.message);

        const flutterError = error?.response?.data;

        res.status(500).json({
            error: flutterError?.message || "Failed to release funds",
            details: flutterError || {}
        });
    }
};


const handleWebhook = async (req,res) => {
    try {
        const payload = req.body;

        if(payload.event === "transfer.completed"){
            const {reference,status} = payload.data;

            if (status === "SUCCESSFUL") {
                const tx = await Transaction.findOne({flw_transfer_ref:reference});
                if (tx) {
                    tx.status = "transfer_confirmed";
                    await tx.save();
                    console.log(`Transfer confirmed for order ${tx.orderId}`)
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error);
        res.sendStatus(500);
    }
}


module.exports = {
    InitiatePayment,verifyTransaction,
    createBeneficiary,InitiateTransfer,
    ReleaseFunds,handleWebhook
}