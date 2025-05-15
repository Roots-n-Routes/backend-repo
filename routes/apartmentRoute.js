const express = require("express");
const passport = require("passport");
const router = express.Router();
const apartmentController = require("../controllers/apartmentController");
const { validateCreateApartment, validateUpdateApartment } = require("../Middleware/accommodation_middleware");
const { upload } = require("../Utils/Cloudinary/config");

// Get all apartments
router.get("/all", apartmentController.getAllApartments);

//Get property search filter
router.get("/search", apartmentController.searchApartment);

// Get a single apartment
router.get("/:id", apartmentController.getApartment);
//router.get("/apartment/:apartmentId", apartmentController.getApartment);

//validate approved apartment
router.put(
  "/:apartmentId/approve",
  passport.authenticate("vendor-jwt", { session: false }),
  apartmentController.getApprove
);

//validate cancel apartment
router.put(
  "/:apartmentId/cancel",
  passport.authenticate("vendor-jwt", { session: false }),
  apartmentController.getCancel
);

// Create an apartment (Host only)
router.post(
  "/create",
  passport.authenticate("vendor-jwt", { session: false }),
  validateCreateApartment,
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "Apartment created successfully",
      apartmentData: req.body,
    });
  },
  apartmentController.createApartment
);
//router.post('/', apartmentController.createApartment);

// To see image upload
router.post(
  "/images",
  passport.authenticate("vendor-jwt", { session: false }),
  upload.array("images", 5),
  apartmentController.createApartment
);
//router.post('/', upload.array('images', 5), apartmentController.createApartment);

// Update an apartment (Host only)
router.put(
  "/:id",
  passport.authenticate("vendor-jwt", { session: false }),
  validateUpdateApartment,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Apartment updated successfully",
      apartmentData: req.body,
    });
  },
  apartmentController.updateApartment
);
//router.put('/:id', apartmentController.updateApartment);

// Delete an apartment (Host/Admin only)
router.delete(
  "/:id",
  passport.authenticate("vendor-jwt", { session: false }),
  apartmentController.deleteApartment
);
//router.delete('/:id', apartmentController.deleteApartment);

module.exports = router;