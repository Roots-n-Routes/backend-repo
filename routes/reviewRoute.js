const express = require("express");
const router = express.Router();
const passport = require('passport');
const { CreateReview, GetApartmentReviews } = require("../Controllers/reviewController");

router.post("/",passport.authenticate('vendor-jwt',{session:false}), CreateReview);
router.post("/", reviewController.createReview);
router.get("/:apartmentId", GetApartmentReviews);

module.exports = router;
