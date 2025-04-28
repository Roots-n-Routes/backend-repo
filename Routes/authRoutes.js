const express = require('express')
const passport = require('passport')
const {upload} = require('../Utils/Cloudinary/config')
const { signUp, Login, GetAll, UploadProfilePicture, UpdateUser, DeleteUser, VerifyControl } = require('../Controllers/auth_Controller');
const validateToken = require('../Middleware/auth_middleware');
const router = express.Router()


router.post('/signup',signUp)
router.post('/login',Login)
router.post('/verify',VerifyControl)
router.get('/all',GetAll)
router.post('/upload',passport.authenticate('user-jwt',{session:false}),upload.single('profile_pictures'),UploadProfilePicture)
router.put('/update',passport.authenticate('user-jwt',{session:false}),UpdateUser)
router.delete('/delete',passport.authenticate('user-jwt',{session:false}),DeleteUser)

//Google OAuth Authenication
router.get('/google',passport.authenticate('google-user',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google-user',{failureRedirect:'/'}), (req,res) =>{
    res.redirect('/dashboard');
});

//Facebook OAuth Authentication''
router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));
router.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/'}),(req,res) =>{
    res.redirect('/dashboard');
});

//Apple OAuth Authentication
router.get('/apple',passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router
  