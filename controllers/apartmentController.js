const apartmentModel = require("../Model/apartmentModel");

// Get all apartments
const GetAllApartments = async (req, res) => {
  try {
    const apartments = await apartmentModel.find({});
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single apartment
const GetApartment = async (req, res) => {
  try {
    const apartment = await apartmentModel.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: 'Not found' });
    res.json(apartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new apartment
const CreateApartment = async (req, res) => {
  try {
    // Get uploaded image paths
    const imagePaths = (req.files || []).map(f => f.path);

    // Create new apartment with all relevant data
    const newApartment = new apartmentModel({
      ...req.body,
      images: imagePaths,
      host: req.user._id, // comes from auth middleware
    });

    await newApartment.save();
    res.status(201).json(newApartment);
  } catch (error) {
    console.error("Error creating apartment:", error);
    res.status(500).json({ error: "Failed to create apartment" });
  }
};

// Update apartment
const UpdateApartment = async (req, res) => {
  try {
    const updated = await apartmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete apartment
const DeleteApartment = async (req, res) => {
  try {
    await apartmentModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search filter
const SearchApartment = async (req, res) => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      travelers,
      guests,
      units,
      minPrice,
      maxPrice,
      amenities
    } = req.query;

    const query = {};

    // Filter by destination
    if (destination) {
      query.destination = { $regex: new RegExp(destination, "i") };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Filter by number of travelers
    if (travelers) {
      query.maxTravelers = { $gte: parseInt(travelers) };
    }

    // Filter by number of guests
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    // Filter by number of units
    if (units) {
      query.availableUnits = { $gte: parseInt(units) };
    }

    // Filter by amenities (expects comma-separated string)
    if (amenities) {
      const amenitiesArray = amenities.split(",");
      query.amenities = { $all: amenitiesArray };
    }

    // Filter by date availability
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      query.bookings = {
        $not: {
          $elemMatch: {
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
          }
        }
      };
    }

    const properties = await apartmentModel.find(query);
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const GetApprove = async (req, res) => {
  const { apartmentId } = req.params;

  const apartment = await apartmentModel.findById(apartmentId);
  if (!apartment) return res.status(404).json({ success: false, message: "Apartment not found" });

  if (apartment.status !== "pending") {
    return res.status(400).json({ success: false, message: "Apartment not pending" });
  }

  apartment.status = "approved";
  await apartment.save();

  res.status(200).json({ success: true, message: "Apartment approved", apartment });
};

const GetCancel = async (req, res) => {
  const { apartmentId } = req.params;

  const apartment = await apartmentModel.findById(apartmentId);
  if (!apartment) return res.status(404).json({ success: false, message: "Apartment not found" });

  if (apartment.status !== "pending") {
    return res.status(400).json({ success: false, message: "Apartment not pending" });
  }

  apartment.status = "cancelled";
  await apartment.save();

  res.status(200).json({ success: true, message: "Apartment cancelled", apartment });
};

module.exports = {
  GetAllApartments,GetApartment,GetApprove,
  CreateApartment,SearchApartment,UpdateApartment,
  DeleteApartment,GetCancel
}
