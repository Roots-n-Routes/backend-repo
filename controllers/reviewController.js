const ReviewServices = require("../Services/reviewServices");

const CreateReview = async (req, res) => {
  try {
    const apartmentId = req.params.apartmentId
    const userId = req.user._id;
    const payload = req.body;

    const CreateReview = await ReviewServices.CreateReview({
      apartmentId: apartmentId,
      rating:payload.rating,
      comment:payload.comment,
      userId: userId
    })
    res.status(CreateReview.code).json(CreateReview)
  } catch (error) {
    return res.status(500).json({message:"Server error", error:error.message})
  }
};

const GetApartmentReviews = async (req, res) => {
  try {
    const apartmentId = req.params.id
    const GetReviews = await ReviewServices.GetReviews({
      apartmentId
    })
    res.status(GetReviews.code).json(GetReviews)
  } catch (error) {
    return res.status(500).json({message:"Server error", error:error.message})
  }
};

module.exports = {CreateReview,GetApartmentReviews}
