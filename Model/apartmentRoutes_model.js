const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all apartments
router.get('/', apartmentController.getAllApartments);

// Get a single apartment
router.get('/:id', apartmentController.getApartment);

// Create an apartment (Host only)
router.post('/', authMiddleware, apartmentController.createApartment);

// Update an apartment (Host only)
router.put('/:id', authMiddleware, apartmentController.updateApartment);

// Delete an apartment (Host/Admin only)
router.delete('/:id', authMiddleware, apartmentController.deleteApartment);

module.exports = router;