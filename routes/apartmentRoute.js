const express = require("express");
const passport = require("passport");
const router = express.Router();
const { validateCreateApartment, validateUpdateApartment } = require("../Middleware/accommodation_middleware");
const { upload } = require("../Utils/Cloudinary/config");
const { GetAllApartments,SearchApartment,GetApartment,GetApprove,GetCancel,CreateApartment,UpdateApartment,DeleteApartment} = require("../controllers/apartmentController");

// Get all apartments
router.get("/all", GetAllApartments);

//Get property search filter
router.get("/search", SearchApartment);

// Get a single apartment
router.get("/:id",GetApartment);

//validate approved apartment
router.put(
  "/:apartmentId/approve",
  passport.authenticate("vendor-jwt", { session: false }),GetApprove);

//validate cancel apartment
router.put(
  "/:apartmentId/cancel",
  passport.authenticate("vendor-jwt", { session: false }),GetCancel);

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
  },CreateApartment);
//router.post('/', apartmentController.createApartment);

// To see image upload
router.post(
  "/images",
  passport.authenticate("vendor-jwt", { session: false }),
  upload.array("images", 5),CreateApartment);

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
  },UpdateApartment);

router.get("/search", SearchApartment);

// Delete an apartment (Host/Admin only)
router.delete(
  "/:id",
  passport.authenticate("vendor-jwt", { session: false }),DeleteApartment);

module.exports = router;