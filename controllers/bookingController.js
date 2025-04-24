const Booking = require("../models/bookingModel");
const Apartment = require("../models/apartmentModel");

exports.createBooking = async (req, res) => {
  const { apartmentId, checkInDate, checkOutDate } = req.body;

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) return res.status(404).json({ error: "Apartment not found" });

  const conflict = apartment.bookings.find(b =>
    new Date(b.checkIn) < new Date(checkOutDate) &&
    new Date(b.checkOut) > new Date(checkInDate)
  );

  if (conflict) return res.status(400).json({ error: "Apartment not available" });

  const totalNights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
  const totalPrice = totalNights * apartment.pricePerNight;

  const booking = new Booking({
    apartment: apartmentId,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    totalPrice
  });

  apartment.bookings.push({ checkIn: checkInDate, checkOut: checkOutDate });

  await booking.save();
  await apartment.save();

  res.status(201).json(booking);
};

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.params.userId }).populate("apartment");
  res.status(200).json(bookings);
};
