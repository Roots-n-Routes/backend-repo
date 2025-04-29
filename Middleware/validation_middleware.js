const Joi = require('joi')

const validateCreateVendor = async (req,res,next) => {
    const bodyOfRequest = req.body
    const schema = Joi.object({
        nameOfBusiness:Joi.string().optional(),
        nob:Joi.string().optional(),
        first_name:Joi.string().optional(),
        last_name:Joi.string().optional(),
        email:Joi.string().email().required(),
        companyPhone:Joi.string().optional(),
        phoneNumber:Joi.string().optional(),
        password:Joi.string().min(4).required(),
        confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
    })

    const {error,value} = schema.validate(bodyOfRequest,{
        abortEarly:false,
        stripUnknown:true
    });
    console.log(value)
    

    if (error) {
        return res.status(422).json({
            success:false,
            message:"Validation failed",
            errors:error.details.map((err) => err.message)
        });
    }
    req.body = value;
    next();
}

const validateUpdateVendor = async(req,res,next) => {
    const bodyOfRequest = req.body
    const schema = Joi.object({
        first_name:Joi.string().optional(),
        last_name:Joi.string().optional(),
        email:Joi.string().email().optional(),
        nameOfBusiness:Joi.string().optional(),
        doi:Joi.string().optional(),
        nob:Joi.string().optional(),
        cobo:Joi.string().optional(),
        aob:Joi.string().optional(),
        state:Joi.string().optional(),
        city:Joi.string().optional(),
        zipcode:Joi.string().optional(),
        coo:Joi.string().optional(),
        spokenLang:Joi.string().optional(),
        spokenLang:Joi.string().optional(),
        noe:Joi.string().optional(),
        companyPhone:Joi.string().optional(),
        companySocial:Joi.string().valid('Facebook', 'Twitter', 'LinkedIn', 'Instagram').optional()
    })

    const valid = await schema.validate(bodyOfRequest);
    console.log(valid)

    if (valid.error) {
        return res.status(422).json({
            message:valid.error.message
        })
    }
    next()
}

module.exports = {validateCreateVendor,validateUpdateVendor}