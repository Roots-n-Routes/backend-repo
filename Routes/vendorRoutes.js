const express = require('express')
const passport = require('passport')
const {upload} = require('../Utils/Cloudinary/config')
const {SignUpBusiness,SignUpVendor,Login,VerifyControl,GetAllVendors,UploadVendorPicture,UpdateVendor,DeleteVendor, ForgotPassword, ResetToken, GetPayments } = require('../Controllers/vendor_controller');
const validateToken = require('../Middleware/auth_middleware');
const { InitiatePayment, verifyTransaction } = require('../Payment/Payments');
const { validateCreateVendor,validateUpdateVendor } = require('../Middleware/validation_middleware');
const router = express.Router()

router.post('/signup-biz',validateCreateVendor,SignUpBusiness)
router.post('/signup-vendor',validateCreateVendor,SignUpVendor)
router.post('/login',Login)
router.post('/verify',VerifyControl)
router.get('/vendorAll', GetAllVendors)
router.get('/all-payments',passport.authenticate('vendor-jwt',{session:false}),GetPayments)
router.post('/upload',passport.authenticate('vendor-jwt',{session:false}),upload.single('profile_picture'),UploadVendorPicture)
router.put('/update',passport.authenticate('vendor-jwt',{session:false}),validateUpdateVendor,UpdateVendor)
router.delete('/delete',passport.authenticate('vendor-jwt',{session:false}),DeleteVendor)


router.post("/pay",validateToken,InitiatePayment)
router.get('/payment/callback',validateToken,verifyTransaction)
router.post('/forgot-password',ForgotPassword)
router.post('/reset-password/:token',ResetToken)

//Google OAuth Authenication
router.get('/google',passport.authenticate('google-vendor',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google-vendor',{failureRedirect:'/'}), (req,res) =>{
    res.redirect('/dashboard');
});

//Facebook OAuth Authentication
router.get('/facebook',passport.authenticate('facebook-vendor',{scope:['email']}));
router.get('/facebook/callback',passport.authenticate('facebook-vendor',{failureRedirect:'/'}),(req,res) =>{
    res.redirect('/dashboard');
});

//Apple OAuth Authentication
router.get('/apple',passport.authenticate('apple-user'));
router.get('/apple/callback', passport.authenticate('apple-user', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;