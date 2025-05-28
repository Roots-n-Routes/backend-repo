const Review = require("../Model/reviewModel");

const CreateReview = async ({apartmentId,rating,comment,userId}) => {
    try {
        const newReview = await Review.create({
            apartmentId,rating,comment
        })
        return{
            code:201,
            success:true,
            message:"Review created successfully",
            data:{
                newReview
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

const GetReviews = async ({apartmentId}) => {
    try {
        const reviews = await Review.find({ apartment: apartmentId}) //.populate("user", "name");
        if (!reviews.length === 0) {
            return{
                code:404,
                success:false,
                message:"No reviews found",
                data:null
            };
        }
        return{
            code:200,
            success:true,
            message:"Reviews available",
            data:{Reviews:reviews}
        }
    } catch (error) {
        return{
        code:500,
        success:false,
        message:error.message,
       }   
    } 
}

module.exports = {CreateReview,GetReviews}