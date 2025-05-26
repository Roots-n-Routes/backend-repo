const apartmentModel = require("../Model/apartmentModel");

const CreateApartment = async({name_of_property,property_address,property_type,spoken_language,property_category,status,payment_status,check_in_options,check_out_options,amenities,room_and_rates,images}) =>{
    try {
      const newApartment = await apartmentModel.create({
         name_of_property,
         property_address,
         property_type,
         spoken_language,
         property_category,
         status,
         payment_status,
         check_in_options,
         check_out_options,
         amenities,
         room_and_rates,
         images
      });
      return{
        code:201,
        success:true,
        message:'User signed up successfully',
        data:{
          newApartment
        }
      }
    } catch (error) {
      return{
        code:500,
        success:false,
        data:null,
        message:error.message
      }
    }
}

// Get all apartments
const GetAllApartments = async (req, res) => {
  try {
    const apartments = await apartmentModel.find({});
    if (!apartments.length === 0) {
        return{
            code:404,
            success:false,
            message:"No apartment found",
            data:null
        };
    }
    return{
        code:200,
        success:true,
        message:"Apartments available",
        data:{Apartments:apartments}
    }
  } catch (err) {
    return{
        code:500,
        success:false,
        message:err.message,
        data:null
    }
  }
};

// Get single apartment
const GetApartment = async ({apartmentId}) => {
  try {
      const apartment = await apartmentModel.findById(apartmentId);
        if (!apartment) {
            return{
                code:404,
                success:false,
                message:"User not found",
                data:null
            }
        }
        return{
            code:200,
            success:true,
            message:"Apartment available",
            data:{Apartment:apartment}
        };
   } catch (err) {
       return{
        code:500,
        success:false,
        message:err.message,
       }      
   }
};

const UpdateApartment = async({apartmentId,name_of_property,property_address,property_type,spoken_language,property_category,status,payment_status,check_in_options,check_out_options,amenities,room_and_rates,images}) =>{
  try {
    const apartment = await apartmentModel.findByIdAndUpdate(apartmentId)
    if (!apartment) {
       return{
        code:404,
        success:false,
        message:'Apartment not found',
        data:null
       }
    }
    apartment.name_of_Property = name_of_property || apartment.name_of_Property
    apartment.property_address = property_address || apartment.property_address
    apartment.property_type = property_type || apartment.property_type
    apartment.spoken_language = spoken_language || apartment.spoken_language,
    apartment.property_category = property_category || apartment.property_category
    apartment.status = status || apartment.status
    apartment.payment_status = payment_status || apartment.payment_status
    apartment.check_in_options = check_in_options || apartment.check_in_options
    apartment.check_out_options = check_out_options || apartment.check_out_options
    apartment.amenities = amenities || apartment.amenities
    apartment.room_and_rates = room_and_rates || apartment.room_and_rates
    apartment.images = images || apartment.images

    await apartment.save()
    return{
      code:200,
      success:false,
      message:"Apartment updated successfully",
      data:{apartment}
    }
  } catch (error) {
    return{
      code:500,
      success:false,
      message:"Apartment not found",
      data:null
    }
  }
}

const SearchApartment = async({queryParams}) => {
  const {
    destination,checkIn,
    checkOut,travellers,
    quests,units,
    minPrice,amenities,maxPrice,
    sortBy = 'pricePerNight',
    sortOrder = 'asc',
    page = 1,
    limit = 10
  } = queryParams

  const query = {};

  if (destination) {
    query.destination = {$regex: new RegExp(destination, "i")};
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if(minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
    if(maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
  }

  if(travellers){
    query.maxTravelers = {$gte: parseInt(travellers)};
  }

  if(quests){
    query.maxGuests = {$gte: parseInt(guests)}
  }

  if(units){
    query.availableUnits = {$gte: parseInt(units)}
  };

  if(amenities){
    const amenitiesArray = amenities.split(',');
    query.amenities = {$all: amenitiesArray};
  }

  if(checkIn && checkOut){
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    query.bookings = {
      $not:{
        $elemMatch:{
          checkIn: {$lt:checkOutDate},
          checkOut: {$gt: checkInDate}
        }
      }
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  //sorting
  const sortQuery = {};
  sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const properties = await apartmentModel
    .find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(parseInt(limit));

    return properties;
}

const GetApprove = async({apartmentId}) => {
  try {
    const apartment = await apartmentId.findById(apartmentId);
    if (!apartment) {
      return{
        code:404,
        success:false,
        message:"Apartment not found",
        data:null
      }
    }

    if(apartment.status !== "pending"){
      return{
          code:404,
          success:false,
          message:"Apartment not found",
          data:null
      }
    }
    apartment.status = 'approved'
    await apartment.save
    
    return{
      code:200,
      success:true,
      message:'Apartment approved',
      data:{apartment}
    }
  } catch (error) {
    return{
      code:500,
      success:false,
      data:null,
      message:error.message
    }
  }
}

const DeleteApartment = async({apartmentId}) =>{
  const apartment = await apartmentModel.findOne({apartmentId});
  if (!apartment) {
      return{
        code:404,
        success:false,
        message:"Apartment not found",
        data:null
      }
  }

  await apartment.deleteOne({
    apartment_id:apartment._id
  })
  return{
    code:200,
    success:true,
    message:"Apartment deleted successfully",
    data:null
  }
}
module.exports = {
  GetAllApartments,GetApartment,GetApprove,
  CreateApartment,SearchApartment,UpdateApartment,
  DeleteApartment,GetCancel
}