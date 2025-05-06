const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const passport = require('passport')

router.post("/",passport.authenticate('vendor-jwt',{session:false}), reviewController.createReview);
router.post("/", reviewController.createReview);
router.get("/:apartmentId", reviewController.getApartmentReviews);

module.exports = router;
