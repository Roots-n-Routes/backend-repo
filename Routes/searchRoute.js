const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartmentController");

router.get("/search", apartmentController.searchApartment);

module.exports = router;
