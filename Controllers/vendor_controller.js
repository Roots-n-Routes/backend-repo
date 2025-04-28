const VendorModel = require('../Model/vendor_model')
const VendorServices = require('../Services/vendor_services')
const passport = require('passport')

const SignUpBusiness = async (req,res) => {
    const payload = req.body
    const SignUpResponse = await VendorServices.VendorBusinessSignUp({
        nameOfBusiness:payload.nameOfBusiness,
        nob:payload.nob,
        email:payload.email,
        companyPhone:payload.companyPhone,
        password:payload.password
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

const Login = (req, res, next) => {
    passport.authenticate('vendor-local', async (err, user, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(400).json({ message: info.message });

        try {
            const response = await VendorServices.sendOtpToVendor(user.email);
            return res.status(response.code).json(response);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    })(req, res, next);
};



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
   try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }

        const profilePictureUrl = req.file.path
        const vendorId = req.user._id
        const vendor = await VendorServices.addVendorProfilePicture(vendorId,profilePictureUrl)

        res.status(200).json({
            message:'Profile picture added successfully',
            vendor,
        });
    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message})
   }
}

const UpdateVendor = async(req,res) =>{
    try {
        const vendorId = req.user._id
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
    const vendor = req.user._id
    
    const deleteResponse = await VendorServices.DeleteVendor({
        vendor
    })
    return res.status(deleteResponse.code).json(deleteResponse)
}

const GetPayments = async(req,res) =>{
    const Allpayments = await VendorServices.GetVendorPayments({})
    res.status(Allpayments.code).json(Allpayments)
}

const ForgotPassword = async (req,res) => {
    const {email} = req.body;
    const vendor = await VendorModel.findOne({email})

    if (!vendor) {
        return res.status(404).json({message:"Vendor not found"});
    }

    //Generate Reset Token
    const resetToken = student.generatePasswordResetToken();
    await vendor.save();

    //create reset url
    const resetUrl = `http://localhost:4000/reset-password/${resetToken}`;

    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        to:student.email,
        subject:"Password Reset Request",
        text:`You requested a password reset. Click the link to reset your password:\n\n ${resetUrl}\n\nIf you did not request this,please ignore this email`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({message:"Password reset link sent to your email."});
    } catch (error) {
        vendor.resetPasswordToken = undefined;
        vendor.resetPasswordExpires = undefined;
        await vendor.save();
        res.status(500).json({message:"Error sending email"});
    }
}


const ResetToken = async (req,res) => {
    const {token} = req.params;
    const {newPassword} = req.body;

    //Hash the token to match the stored one
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const vendor = await VendorModel.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if (!vendor) {
        return res.status(400).json({message:"Invalid or expired token"});
    }

    vendor.password = newPassword;
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;
    await vendor.save();

    res.json({message:"Password reset successfull. You can log in now."})
}

module.exports = {
    SignUpBusiness,SignUpVendor,Login,VerifyControl,GetAllVendors,UploadVendorPicture,GetAllVendors,
    UpdateVendor,DeleteVendor,ForgotPassword,ResetToken,GetPayments
}