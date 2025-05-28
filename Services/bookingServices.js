const Booking = require("../Model/bookingModel");
const Apartment = require("../Model/apartmentModel");

const CreateBookings = async({apartmentId,checkInDate,checkOutDate}) =>{
    try {
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return{
                code:404,
                success:false,
                message:"Apartment not found",
                data:null
            }
        }
    } catch (error) {
        
    }
}