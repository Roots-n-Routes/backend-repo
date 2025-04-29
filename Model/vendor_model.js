const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const VendorSchema = mongoose.Schema(
    {
        first_name:{
            type:String,
            required:[false, "Please enter your first name"]
        },
        last_name:{
            type:String,
            required:[false, "Please enter your last name"]
        },
        email:{
            type:String,
            required:[false, "Please enter your email"]
        },
        nameOfBusiness:{
            type:String,
            required:[false,"Please enter your business name"]
        },
        doi:{
            type:String,
            required:[false,"Please enter your date of incorporation"]
        },
        nob:{
            type:String,
            required:[false,"Please enter your Nature of Business"]
        },
        cobo:{
            type:String,
            required:[false,"Please enter your Country Of Business Operations"]
        },
        aob:{
            type:String,
            required:[false,"Please enter Address Of Business"]
        },
        state:{
            type:String,
            required:[false,"Please enter your state"]
        },
        city:{
            type:String,
            required:[false,"Please enter your city"]
        },
        zipcode:{
            type:String,
            required:[false,"Please enter your Zip Code"]
        },
        coo:{
            type:String,
            enum:[],
            required:[false,"Please enter your Country Of Operations"]
        },
        spokenLang:{
            type:String,
            enum:[],
            required:[false,"Please enter your spoken languages"]
        },
        noe:{
            type:String,
            required:[false,"Please enter your number of employees"]
        },
        companyPhone:{
            type:Number,
            required:[false,"Please enter your company phone number"]
        },
        companySocials:{
            type:String,
            enum:['Facebook','Twitter','LinkedIn','Instagram'],
            required:[false,"Please enter company social media handles"]
        },
        profilePicture:{
            type:String,
            default:null
        },
        account_number:{
            type:String
        },
        bankCode:{
            type:String
        },
        password:{
            type:String,
            required:[true,"Please enter your password"]
        },
        resetPasswordToken:{
            type:String,
            require:false
        },
        resetPasswordExpires:{
            type:Date,
            required:false
        },
        created_at:{
            type:Date,
        },
        updated_at:{
            type:Date
        }
    }
)

VendorSchema.pre(
    'save',
    async function (next){
        const user = this;
        if(!this.isModified('password')) return next()

        const hash = await bcrypt.hash(this.password,10);
        this.password = hash;
        next()
    }
)

VendorSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password)
    return compare
}

VendorSchema.methods.generatedPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000
    return resetToken;
}

const VendorModel = mongoose.model("vendors",VendorSchema)

module.exports = VendorModel