const express = require('express');
const router = express.Router();
const apartment = require("../models/apartmentModel");
const apartmentController = require('../controllers/apartmentController');
const { validateToken, validateVendor } = require("../middlewares/auth_middleware");
//const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload");

// Get all apartments
router.get('/', apartmentController.getAllApartments);

//Get property search filter
router.get("/search", apartmentController.searchApartment);

// Get a single apartment
router.get('/:id', apartmentController.getApartment);

// Create an apartment (Host only)
router.post('/', validateVendor, apartmentController.createApartment);
//router.post('/', apartmentController.createApartment);

// To see image upload
router.post('/', validateToken, upload.array('images', 5), apartmentController.createApartment);
//router.post('/', upload.array('images', 5), apartmentController.createApartment);

// Update an apartment (Host only)
router.put('/:id', validateVendor, apartmentController.updateApartment);
//router.put('/:id', apartmentController.updateApartment);

// Delete an apartment (Host/Admin only)
router.delete('/:id', validateVendor, apartmentController.deleteApartment);
//router.delete('/:id', apartmentController.deleteApartment);

module.exports = router;