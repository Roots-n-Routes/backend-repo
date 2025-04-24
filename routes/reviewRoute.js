const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { validateToken } = require("../middlewares/auth_middleware");

router.post("/", validateToken, reviewController.createReview);
router.post("/", reviewController.createReview);
router.get("/:apartmentId", reviewController.getApartmentReviews);

module.exports = router;
