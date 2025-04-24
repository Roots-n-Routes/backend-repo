const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { validateToken } = require("../middlewares/auth_middleware");

router.post("/", validateToken, bookingController.createBooking);
//router.post("/", bookingController.createBooking);

router.get("/:userId", validateToken, bookingController.getUserBookings);
//router.get("/:userId", bookingController.getUserBookings);

module.exports = router;
