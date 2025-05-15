const Joi = require('joi'); // Require Joi only once at the top

const predefinedAmenities = [
  "wifi",
  "parking lot",
  "swimming pool",
  "play station",
  "snooker table",
  "air conditioner",
  "water heater",
  "pressure pump",
  "Electric cooker",
  "Gas cooker",
  "bath tub"
];

// Shared amenity schema
const amenitySchema = Joi.object({
  name: Joi.string().required().label("Amenity Name"),
  isPredefined: Joi.boolean().required().label("Is Predefined"),
  description: Joi.string()
    .when('isPredefined', {
      is: false,
      then: Joi.string().min(2).required().label("Custom Amenity Description"),
      otherwise: Joi.optional()
    })
});

// Shared apartment schema
const apartmentSchema = Joi.object({
  amenities: Joi.array()
    .items(amenitySchema)
    .min(1)
    .unique((a, b) => a.name === b.name)
    .optional()
});


// CREATE Middleware
const validateCreateApartment = async (req, res, next) => {
  const { error, value } = apartmentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((err) => err.message)
    });
  }

  req.body = value;
  next();
};

// UPDATE Middleware (uses same schema — you can separate if needed)
const validateUpdateApartment = async (req, res, next) => {
  const { error, value } = apartmentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((err) => err.message)
    });
  }

  req.body = value;
  next();
};

// Cancel Accommodation Middleware (uses same schema — you can separate if needed)


// Approve Accommodation Middleware (uses same schema — you can separate if needed)


module.exports = { validateCreateApartment, validateUpdateApartment };
