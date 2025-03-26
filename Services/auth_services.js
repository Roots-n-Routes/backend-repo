const UserModel = require('../Model/user_model')
const mongoose = require('mongoose')
const speakeasy = require('speakeasy')
const jwt = require('jsonwebtoken')
const { redisClient} = require('../Utils/OTP/OTP.JS')
const {transporter} = require('../Utils/OTP/OTP.JS')
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
        // const token = jwt.sign({id:user._id, email:user.email},
        //     process.env.JWT_SECRET,{expiresIn:"1d"}
        // );
        
        //Generate OTP
        const otp = speakeasy.totp({
            secret:process.env.OTP_SECRET,
            digits:6,
            step:300
        });

        //store otp in redis with 5-min expiration
        await redisClient.setEx(`otp:${email}`,300,otp)

        //send OTP via email
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"OTP CODE",
            text:`Your OTP is ${otp}. It expires in 5 minutes.`,
        });

        return {
            code:200,
            success:true,
            //data:{user,token},
            data:{email},
            message:'OTP sent Successfully'
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

const VerifyOTP = async (email,userOTP) => {
    const storedOTP = await redisClient.get(`otp:${email}`)
    const user = await UserModel.findOne({email});

    if (!storedOTP || storedOTP !== userOTP) {
        return{
            code:401,
            success:false,
            message:"Invalid or Expired OTP",
        };
    }
    //OTP verified, delete from redis
    await redisClient.del(`otp:${email}`)

    // Generate JWT token
    const token = jwt.sign({id:user._id, email:user.email},
        process.env.JWT_SECRET,{expiresIn:"1d"}
     );

    return {
        code: 200,
        success: true,
        data: {user,token},
        message: "OTP verified. Login successful.",
      };
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

const UpdateUser = async ({userId,first_name,last_name,dob,email,gender,phone_number1,phone_number2,emergency_contact,password,nationality,profilePicture}) => {
    try {
        const user = await UserModel.findById(userId)

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
        user.password = password || user.password

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
    SignUp,login,GetAllUsers,addUserProfilePicture,UpdateUser,DeleteUser,VerifyOTP
}