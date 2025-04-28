const express = require('express')
const validateToken = require('../Middleware/auth_middleware')
const { CreateOrder, GetAllOrder, ConfirmDelivery } = require('../Controllers/order_controlller')
const passport = require('passport')
const router = express.Router()


router.post("/create-order",passport.authenticate('vendor-jwt',{session:false}),CreateOrder)
router.get("/get-orders",GetAllOrder)
router.post('/confirm-delivery',passport.authenticate('vendor-jwt',{session:false}),ConfirmDelivery)

module.exports = router;
