const passport = require('passport')
const { InitiatePayment, verifyTransaction, ReleaseFunds, handleWebhook } = require('../Payment/Payments');
const express = require('express');
const verifyflutterWebhook = require('../Middleware/payment_middleware');
const router = express.Router()

router.post("/release",ReleaseFunds);
router.post("/webhook",express.json(), verifyflutterWebhook,handleWebhook)
router.post("/pay",passport.authenticate('vendor-jwt',{session:false}),InitiatePayment)
router.get('/verify-payment',passport.authenticate('vendor-jwt',{session:false}),verifyTransaction)


module.exports = router;

// http://localhost:4000
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDg0YjJkNWI2MjA0Mjc3ZTAxZjZlNyIsImVtYWlsIjoibW9uaWFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzAwNzI5LCJleHAiOjE3NDU3ODcxMjl9.vSrm-S8xFvaYCVe4c4Gm5YwD5WK0SmUJijBhClRU_pc
//  680d65078fb11c6f4a4c0930