const apartmentModel = require("../Model/apartmentModel");

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

const CreateApartment = async({}) =>{
    try {
      const newApartment = await apartmentModel.create({
        
      })
    } catch (error) {
      
    }
}


module.exports = {
  GetAllApartments,GetApartment,GetApprove,
  CreateApartment,SearchApartment,UpdateApartment,
  DeleteApartment,GetCancel
}