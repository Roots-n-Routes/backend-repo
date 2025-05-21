const express = require("express");
const passport = require('passport');
const { CreateBooking, GetUserBookings } = require("../Controllers/bookingController");
const router = express.Router();


router.post("/",passport.authenticate('user-jwt',{session:false}), CreateBooking);
//router.post("/", bookingController.createBooking);

router.get("/:userId",passport.authenticate('user-jwt',{session:false}), GetUserBookings);
//router.get("/:userId", bookingController.getUserBookings);

module.exports = router;
