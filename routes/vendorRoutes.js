const express = require('express')
const passport = require('passport')
const {upload} = require('../Utils/Cloudinary/config')
const {SignUpBusiness,SignUpVendor,Login,VerifyControl,GetAllVendors,UploadVendorPicture,UpdateVendor,DeleteVendor } = require('../Controllers/vendor_controller');
const {validateToken,validateVendor} = require('../middlewares/auth_middleware');
const { Initiate, Redirect } = require('../Payment/initiatePayment');
const router = express.Router()


router.post('/signup-biz',SignUpBusiness)
router.post('/signup-vendor',SignUpVendor)
router.post('/login',Login)
router.post('/verify',VerifyControl)
router.get('/vendorAll', GetAllVendors)
router.post('/upload/:vendorId',upload.single('profile_picture'),UploadVendorPicture)
router.put('/update',validateToken,UpdateVendor)
router.delete('/delete/:vendorId',validateToken,DeleteVendor)
router.post("/pay",validateToken,Initiate)
router.get('/payment/callback',validateToken,Redirect)

//Google OAuth Authenication
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}), (req,res) =>{
    res.redirect('/dashboard');
});

//Facebook OAuth Authentication
router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));
router.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/'}),(req,res) =>{
    res.redirect('/dashboard');
});

//Apple OAuth Authentication
router.get('/apple',passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;