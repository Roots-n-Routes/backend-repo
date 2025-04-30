const express = require("express");
const passport = require('passport')
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/",passport.authenticate('user-jwt',{session:false}), bookingController.createBooking);
//router.post("/", bookingController.createBooking);

router.get("/:userId",passport.authenticate('user-jwt',{session:false}), bookingController.getUserBookings);
//router.get("/:userId", bookingController.getUserBookings);

module.exports = router;
