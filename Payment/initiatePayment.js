const Transaction = require('../models/transaction_model')
const axios = require('axios')
const {v4:uuidv4} = require('uuid')
require('dotenv').config()

const Initiate = async (req,res) => {
    try {
        const {amount,email,currency} = req.body
        const transactionId = `tx-${Date.now()}-${uuidv4()}`;

        const transaction = new Transaction({
            transactionId,
            userEmail:email,
            amount:amount,
            currency:currency,
            status:"pending" 
        })
        await transaction.save()

        const paymentData = {
            tx_ref:transactionId,
            amount,
            currency: currency || 'NGN',
            redirect_url:'https://example_company.com/success', //F.E will give a link it should return after successful payment
            customer:{
                email
            },
            customizations:{
                title:"Roots and Routes",
                description:"Payment for vacation",
                logo:"roots and routes website link"
            },
        };

        const response = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            paymentData,
            {
                headers:{
                Authorization:`Bearer ${process.env.FLW_SECRET_KEY}`},
                'Content-Type':'application/json'
            }
        );
        return res.json({ link: response.data.data.link, transaction });
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}
const Redirect = async (req, res) => {
    try {
        const { transaction_id } = req.query;

        if (!transaction_id) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        // Verify transaction
        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            {
                headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
            }
        );

        const { status } = response.data.data;

        // Update transaction status in database
        const transaction = await Transaction.findOneAndUpdate(
            { transactionId: transaction_id },
            { status },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found in database" });
        }

        return res.json({ message: `Payment ${status}`, transaction });
    } catch (error) {
        console.error("Flutterwave Error:", error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || error.message });
    }
};
    

module.exports = {Initiate,Redirect}