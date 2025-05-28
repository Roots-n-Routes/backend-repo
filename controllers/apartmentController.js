const ApartmentService = require("../Services/apartmentServices");

// Get all apartments
const GetAllApartments = async (req, res) => {
  try {
    const AllApartments = await ApartmentService.GetAllApartments({})
    res.status(AllApartments.code).json(AllApartments)
  } catch (error) {
    res.status(500).json({message:"Server error", error:error.message})
  }
};

// Get single apartment
const GetApartment = async (req, res) => {
  try {
    const apartmentId = req.params.id
    const GetSingleApartment = await ApartmentService.GetApartment(apartmentId)
    res.status(GetSingleApartment.code).json(GetSingleApartment)
  } catch (error) {
    return res.status(500).json({message:"Server error",error:error.message})
  }
};

// Create new apartment
const CreateApartment = async (req, res) => {
  try {
    const payload = req.body
    const CreateResponse = await ApartmentService.CreateApartment({
      name_of_property:payload.name_of_property,
      property_address:payload.property_address,
      property_type:payload.property_type,
      spoken_language:payload.spoken_language,
      property_category:payload.property_category,
      status:payload.status,
      payment_status:payload.payment_status,
      check_in_options:payload.check_in_options,
      check_out_options:payload.check_out_options,
      amenities:payload.amenities,
      room_and_rates:payload.room_and_rates,
      images:payload.images
    })
    res.status(CreateResponse.code).json(CreateResponse)
  } catch (error) {
    return res.status(500).json({message:"Server error",error:error.message})
  }
};

// Update apartment
const UpdateApartment = async (req, res) => {
  try {
    const apartmentId = req.params
    const { 
      name_of_property,property_address,property_type,
      spoken_language,property_category,status,payment_status,
      check_in_options,check_out_options,amenities,
      room_and_rates,images} = req.body

    const UpdateResponse = await ApartmentService.UpdateApartment({
      apartmentId,
      name_of_property,property_address,property_type,
      spoken_language,property_category,status,
      payment_status,check_in_options,check_out_options,
      amenities,room_and_rates,images
    })
    res.status(UpdateResponse.code).json(UpdateResponse)
  } catch (error) {
    return res.status(500).json({message:"Server error",error:error.message})
  }
};

// Delete apartment
const DeleteApartment = async (req, res) => {
  try {
    const apartmentId = req.user
    const DeleteResponse = await ApartmentService.DeleteApartment(apartmentId)
    res.status(DeleteResponse.code).json(DeleteResponse)
  } catch (error) {
    return res.status(500).json({message:"Server error", error: error.message });
  }
};

// Search filter
const SearchApartment = async (req, res) => {
  try {
    const SearchResponse = await ApartmentService.SearchApartment(req.query);
    res.status(SearchResponse.code).json(SearchResponse)
  } catch (error) {
     res.status(500).json({message:"Server error",error: error.message });
  }
};


const GetApprove = async (req, res) => {
  try {
    const ApproveResponse = await ApartmentService.GetApprove();
    res.status(ApproveResponse.code).json(ApproveResponse)
  } catch (error) {
      res.status(500).json({message:"Server error",error: error.message });
  }
};

const GetCancel = async (req, res) => {
 try {
  const CancelResponse = await ApartmentService.GetCancel()
  res.status(CancelResponse.code).json(CancelResponse);
 } catch (error) {
    res.status(500).json({message:"Server error",error: error.message }); 
 }
};

module.exports = {
  GetAllApartments,GetApartment,GetApprove,
  CreateApartment,SearchApartment,UpdateApartment,
  DeleteApartment,GetCancel
}
