const UserModel = require('../Model/user_model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async({email,password}) =>{
    try {
        const user = await UserModel.findOne({email});

        if(!user){
            return{
                code:400,
                success:false,
                data:null,
                message:'Invalid Credentials'
            }
        }
        const validPassword = await user.isValidPassword(password)
        if (!validPassword) {
            return {
                code:400,
                success:false,
                data:null,
                message:'Invalid Credentials'
            }
        }
        const token = jwt.sign({id:user._id, email:user.email},
            process.env.JWT_SECRET,{expiresIn:"1d"}
        );
        return {
            code:200,
            success:true,
            data:{user,token},
            message:'Login Successful'
        }
    } catch (error) {
        return {
            code:500,
            success:false,
            data:null,
            message:error.message || 'Server Error'
        }
    }
}

const SignUp = async ({first_name,last_name,password,email,gender}) => {
    try {
        const newUser = await UserModel.create({
            first_name,
            last_name,
            password,
            email,
            gender
        });
        return{
            code:201,
            success:true,
            message:'User signed up successfully',
            data:{
                user:newUser
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

const GetAllUsers = async(req,res) =>{
    try {
        const users = await UserModel.find({})
        if (!users.length === 0) {
            return{
                code:404,
                success:false,
                message:"No User available",
                data:null
            };
        }
        return{
            code:200,
            success:true,
            message:"User available",
            data:{users}
        };
    } catch (error) {
        return{
            code:500,
            success:false,
            message:'An error occured while getting users'
        }
    }
}

const addUserProfilePicture = async (userId, profilePictureUrl) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {profilePicture:profilePictureUrl},
            {new:true}
        );

        if(!user){
            throw new Error("User not found")
        }

        return user;
    } catch (error) {
        throw new Error(error.message)
    }
}

const UpdateUser = async ({userId,first_name,last_name,dob,email,gender,phone_number1,phone_number2,emergency_contact,nationality,profilePicture}) => {
    try {
        const user = await UserModel.findById({_id:userId})

        if (!user) {
            return{
                code:404,
                success:false,
                message:"User not found",
                data:null
            }
        }

        user.first_name = first_name || user.first_name
        user.last_name = last_name || user.last_name
        user.dob = dob || user.dob
        user.email = email || user.email
        user.gender = gender || user.gender
        user.phone_number1 = phone_number1 || user.phone_number1
        user.phone_number2 = phone_number2 || user.phone_number2
        user.emergency_contact = emergency_contact || user.emergency_contact
        user.nationality = nationality || user.nationality
        user.profilePicture = profilePicture || user.profilePicture

        await user.save()
        return{
            code:200,
            success:true,
            message:"User updated successfully",
            data:{user}
        }
    } catch (error) {
        return{
            code:500,
            success:false,
            message:"User not found",
            data:null
        }
    }
}

const DeleteUser = async({userId}) =>{
    const user = await UserModel.findOne({userId});
    if (!user) {
        return{
            code:404,
            success:false,
            message:"User not found",
            data:null
        }
    }
    await user.deleteOne({
        user_id:user._id
    })
    return{
        code:200,
        success:true,
        message:"User deleted successfully",
        data:null
    }
}


module.exports = {
    SignUp,login,GetAllUsers,addUserProfilePicture,UpdateUser,DeleteUser
}