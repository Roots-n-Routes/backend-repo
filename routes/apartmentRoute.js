const express = require('express');
const passport = require('passport')
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');
const {upload} = require('../Utils/Cloudinary/config')

// Get all apartments
router.get('/', apartmentController.getAllApartments);

//Get property search filter
router.get("/search", apartmentController.searchApartment);

// Get a single apartment
router.get('/:id', apartmentController.getApartment);

// Create an apartment (Host only)
router.post('/',passport.authenticate('vendor-jwt',{session:false}), apartmentController.createApartment);
//router.post('/', apartmentController.createApartment);

// To see image upload
router.post('/',passport.authenticate('vendor-jwt',{session:false}), upload.array('images', 5), apartmentController.createApartment);
//router.post('/', upload.array('images', 5), apartmentController.createApartment);

// Update an apartment (Host only)
router.put('/:id',passport.authenticate('vendor-jwt',{session:false}), apartmentController.updateApartment);
//router.put('/:id', apartmentController.updateApartment);

// Delete an apartment (Host/Admin only)
router.delete('/:id',passport.authenticate('vendor-jwt',{session:false}), apartmentController.deleteApartment);
//router.delete('/:id', apartmentController.deleteApartment);

module.exports = router;