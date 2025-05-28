const AuthService = require('../Services/auth_services')
const passport = require('passport');

const signUp = async (req,res) => {
    const payload = req.body
    const SignUpResponse = await AuthService.SignUp({
        first_name:payload.first_name,
        last_name:payload.last_name,
        email:payload.email,
        password:payload.password,
        gender:payload.gender
    })
    res.status(SignUpResponse.code).json(SignUpResponse)
}

const Login = (req,res,next) =>{
    passport.authenticate('user-local', async(err,user,info) =>{
        if(err) return res.status(500).json({message:err.message})
            if(!user) return res.status(400).json({message:info.message});
         //const payload = req.body

         try {
             //Generate jwt token
            const loginResponse = await AuthService.sendOtpToVendor(user.email);
            return res.status(loginResponse.code).json(loginResponse)
         } catch (error) {
            return res.status(500).json({message:error.message})
         }
    })(req,res,next);
}

const VerifyControl = async (req,res,next) =>{
    const {email,otp} = req.body

    if (!email || !otp) {
        return res.status(400).json({message:"Email and OTP are required"})
    }
    const otpResponse = await AuthService.VerifyOTP(email,otp)
    res.status(otpResponse.code).json(otpResponse);
};

const GetAll = async(req,res) =>{
    const allUsersResponse = await AuthService.GetAllUsers({})
    res.status(allUsersResponse.code).json(allUsersResponse)
}


const UploadProfilePicture = async (req,res) => {
   try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }

        const profilePictureUrl = req.file.path;
        const userId = req.user._id;

        const user = await AuthService.addUserProfilePicture(userId,profilePictureUrl);

        res.status(200).json({
            message:'Profile picture added successfully',
            user,   
        });
    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message})
   }
}

const UpdateUser = async(req,res) =>{
    try {
        const userId = req.user._id
        console.log(userId)

        const {first_name,last_name,email,dob,gender,nationality,emergency_contact,profilePicture,phone_number1,phone_number2} = req.body
    
        const updateResponse = await AuthService.UpdateUser({
            userId,
            first_name,last_name,dob,email,gender,phone_number1,phone_number2,emergency_contact,nationality,profilePicture
        })
        console.log(userId)
        return res.status(updateResponse.code).json(updateResponse)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
   
}

const DeleteUser = async (req,res) => {
    const user = req.user._id
    const deleteResponse = await AuthService.DeleteUser({
        user
    })
    return res.status(deleteResponse.code).json(deleteResponse)
}

module.exports = {
    signUp,Login,GetAll,UploadProfilePicture,UpdateUser,DeleteUser,VerifyControl
}