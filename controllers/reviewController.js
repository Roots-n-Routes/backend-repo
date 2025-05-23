const Review = require("../Model/reviewModel");

const CreateReview = async (req, res) => {
  const { apartment, rating, comment } = req.body;

  const existing = await Review.findOne({ apartment, user: req.user._id });
  if (existing) return res.status(400).json({ message: "You have already reviewed this apartment." });

  const review = new Review({ apartment, user: req.user._id, rating, comment });
  await review.save();
  res.status(201).json(review);
};

const GetApartmentReviews = async (req, res) => {
  const reviews = await Review.find({ apartment: req.params.apartmentId }).populate("user", "name");
  res.status(200).json(reviews);
};

module.exports = {CreateReview,GetApartmentReviews}
