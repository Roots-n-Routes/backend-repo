const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
    {
        first_name:{
            type:String,
            required:[true, "Please enter your first name"]
        },
        last_name:{
            type:String,
            required:[true, "Please enter your last name"]
        },
        dob:{
            type:String,
            required:[false]
        },
        email:{
            type:String,
            required:[true,"Please enter your email"]
        },
        gender:{
            type:String,
            enum:['male','female'],
            required:[true,"Please state your gender"]
        },
        phone_number1:{
            type:String,
            required:[false]
        },
        phone_number2:{
            type:String,
            required:[false]
        },
        emergencyContact:{
            type:String,
            required:[false]
        },
        verification:{
            type:String,
            enum:["International Passport","NIN","Drivers License"]
        },
        nationality:{
            type:String,
            required:[false]
        },
        about_me:{
            type:String,
            required:false
        },
        profilePicture:{
            type:String,
            default:null
        },
        id_number:{
            type:String,    
            required:false
        },
        password:{
            type:String,
            required:[true,'Pleae enter your password']
        },
        created_at:{
            type:Date
        },
        updated_at:{
            type:Date
        }
    }
);

UserSchema.pre(
    'save',
    async function (next){
        const user = this;
        const hash = await bcrypt.hash(this.password,10);
        this.password = hash;
        next()
    }
)

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password)
    return compare
}

const UserModel = mongoose.model("users",UserSchema)

module.exports = UserModel