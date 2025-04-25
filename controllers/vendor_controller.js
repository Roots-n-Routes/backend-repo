const VendorServices = require('../Services/vendor_services')
const passport = require('passport')

const SignUpBusiness = async (req,res) => {
    const payload = req.body
    const SignUpResponse = await VendorServices.VendorBusinessSignUp({
        nameOfBusiness:payload.nameOfBusiness,
        nob:payload.nob,
        email:payload.email,
        companyPhone:payload.companyPhone,
        password:payload.password,
    })
    console.log("Sign:",SignUpResponse)
    res.status(SignUpResponse.code).json(SignUpResponse)
}

const SignUpVendor = async (req,res) => {
    const payload = req.body
    const SignUpResponse = await VendorServices.VendorPrivateSignUp({
        first_name:payload.first_name,
        last_name:payload.last_name,
        email:payload.email,
        phoneNumber:payload.phoneNumber,
        password:payload.password
    })
    res.status(SignUpResponse.code).json(SignUpResponse)
}

const Login = (req,res,next) =>{
    passport.authenticate('local',async (err,user,info) => {
        if(err) return res.status(500).json({message:err.message})
            if(!user) return res.status(400).json({message:info.message});
            
        const payload = req.body
        //Generate jwt token
        const loginResponse = await VendorServices.vendorLogin({
            email:payload.email,
            password:payload.password
        })
        console.log("Stored Hashed Password:", user.password);
        console.log("Payload:", loginResponse);
        res.status(loginResponse.code).json(loginResponse)
    })(req,res,next);
}

const VerifyControl = async (req,res,next) => {
    const {email,otp} = req.body

    if(!email || !otp){
        return res.status(400).json({message:"Email and OTP and OTP are required"})
    }
    const otpResponse = await VendorServices.VerifyOTP(email,otp)
    res.status(otpResponse.code).json(otpResponse)
}

const GetAllVendors = async (req,res) => {
    const allVendorsResponse = await VendorServices.GetAllVendors({})
    res.status(allVendorsResponse.code).json(allVendorsResponse)
}

const UploadVendorPicture = async (req,res) => {
    const {vendorId} = req.params;
   try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }

        const profilePictureUrl = req.file.path
        const vendor = await VendorServices.addVendorProfilePicture(vendorId,profilePictureUrl)

        res.status(200).json({
            message:'Profile picture added successfully',
            vendor,
        });
    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message})
   }
}
//Begin fromm chatgpt
const UpdateVendor = async(req,res) =>{
    try {
        const vendorId = req.user.id
        console.log("Auhenticated vendorID:", vendorId)

        const {first_name,last_name,email,nameOfBusiness,doi,nob,cobo,aob,profilePicture,state,city,zipcode,coo,spokenLang,noe,companyPhone,companySocials,password} = req.body
    
        const updateResponse = await VendorServices.UpdateVendor({
            vendorId,
            first_name,last_name,email,doi,nameOfBusiness,doi,nob,cobo,aob,state,city,profilePicture,zipcode,coo,spokenLang,noe,companyPhone,companySocials,password
        })
        console.log(vendorId)
        return res.status(updateResponse.code).json(updateResponse)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
}

const DeleteVendor = async (req,res) => {
    const vendor = req.vendor
    
    const deleteResponse = await VendorServices.DeleteVendor({
        vendor
    })
    return res.status(deleteResponse.code).json(deleteResponse)
}

module.exports = {
    SignUpBusiness,SignUpVendor,Login,VerifyControl,GetAllVendors,UploadVendorPicture,GetAllVendors,
    UpdateVendor,DeleteVendor
}