const VendorModel = require('../Model/vendor_model')
const speakeasy = require('speakeasy')
const jwt = require('jsonwebtoken')
const { redisClient} = require('../Utils/OTP/OTP.JS')
const {transporter} = require('../Utils/OTP/OTP.JS')
require('dotenv').config()

const vendorLogin = async({email,password}) =>{
    try{
        const vendor = await VendorModel.findOne({email});
        console.log("Vendor", vendor)

        if(!vendor){
            return{
                code:400,
                success:false,
                data:null,
                message:"Invalid Credentials"
            }
        }
        const validPassword = await vendor.isValidPassword(password)
        if (!validPassword) {
            return{
                code:400,
                success:false,
                data:null,
                message:'Invalid Credentials'
            }
        }
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
    }catch (error) {
        return {
            code:500,
            success:false,
            data:null,
            message:error.message || 'Server Error'
        }
    }
}

const VendorBusinessSignUp = async ({nameOfBusiness,nob,email,companyPhone,password}) => {
    try {
        const newBusiness = await VendorModel.create({
            nameOfBusiness,nob,companyPhone,password,email
        });
        console.log("User:",newBusiness)
        return{
            code:201,
            success:true,
            message:"Business signed up successfully",
            data:{
                user:newBusiness
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

const VendorPrivateSignUp = async ({first_name,last_name,email,phoneNumber,password}) => {
    try {
        const newPrivate = await VendorModel.create({
            first_name,last_name,email,phoneNumber,password
        });
        return{
            code:201,
            success:true,
            message:"Private vendor signed up successfully",
            data:{
                user:newPrivate
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

const VerifyOTP = async (email,vendorOTP) => {
    const storedOTP = await redisClient.get(`otp:${email}`)
    const user = await VendorModel.findOne({email});

    if (!storedOTP || storedOTP !== vendorOTP) {
        return{
            code:401,
            success:false,
            message:"Invalid or Expired OTP",
        };
    }
    //OTP verified, delete from redis
    await redisClient.del(`otp:${email}`)

    // Generate JWT token
    const token = jwt.sign(
        { id:user._id, email:user.email},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     );
     console.log('Generated Token:',token)

    return {
        code: 200,
        success: true,
        data: {user,token},
        message: "OTP verified. Login successful.",
      };
}

const UpdateVendor = async ({vendorId,first_name,last_name,email,nameOfBusiness,doi,nob,cobo,aob,state,city,zipcode,coo,spokenLang,noe,companyPhone,companySocials,password,confirmPassword}) => {
    try {
        const vendor = await VendorModel.findById(vendorId)
        console.log("Vendor",vendor)
        if (!vendor) {
            return{
                code:404,
                success:false,
                message:"Vendor not found",
                data:null
            }
        }
        vendor.first_name = first_name || vendor.first_name
        vendor.last_name = last_name || vendor.last_name
        vendor.doi = doi || vendor.doi
        vendor.email = email || vendor.email
        vendor.nameOfBusiness = nameOfBusiness || vendor.nameOfBusiness
        vendor.nob = nob || vendor.nob
        vendor.cobo = cobo || vendor.cobo
        vendor.aob = aob || vendor.aob
        vendor.state = state || vendor.state
        vendor.city = city || vendor.city
        vendor.zipcode = zipcode || vendor.zipcode
        vendor.coo = coo || vendor.coo
        vendor.spokenLang = spokenLang || vendor.spokenLang
        vendor.noe = noe || vendor.noe
        vendor.companyPhone = companyPhone || vendor.companyPhone
        vendor.companySocials = companySocials || vendor.companySocials
        vendor.password = password || vendor.password
        // if (password) {
        //     vendor.password = await bcrypt.hash(password, 10);
        // }

        await vendor.save()
        return{
            code:200,
            success:true,
            message:"Vendor updated successfully",
            data:{vendor}
        }
    } catch (error) {
        return{
            code:500,
            success:false,
            message:"Vendor not found",
            data:null
        }
    }
}

const GetAllVendors = async(req,res) =>{
    try {
        const vendors = await VendorModel.find({})
        if (!vendors.length === 0) {
            return{
                code:404,
                success:false,
                message:"No Vendor available",
                data:null
            };
        }
        return{
            code:200,
            success:true,
            message:"Vendor available",
            data:{vendors}
        };
    } catch (error) {
        return{
            code:500,
            success:false,
            message:'An error occured while getting vendor'
        }
    }
}

const addVendorProfilePicture = async (vendorId, profilePictureUrl) => {
    try {
        const vendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            {profilePicture:profilePictureUrl},
            {new:true}
        );

        if(!vendor){
            throw new Error("Vendor not found")
        }

        return vendor;
    } catch (error) {
        throw new Error(error.message)
    }
}


const DeleteVendor = async({vendorId}) =>{
    const vendor = await VendorModel.findOne({vendorId});
    if (!vendor) {
        return{
            code:404,
            success:false,
            message:"Vendor not found",
            data:null
        }
    }
    await vendor.deleteOne({
        vendor_id:vendor._id
    })
    return{
        code:200,
        success:true,
        message:"Vendor deleted successfully",
        data:null
    }
}

module.exports = {
    vendorLogin, VendorBusinessSignUp, 
    VendorPrivateSignUp,VerifyOTP,GetAllVendors,
    addVendorProfilePicture,DeleteVendor,UpdateVendor
}