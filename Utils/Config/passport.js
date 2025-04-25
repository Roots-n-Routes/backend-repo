// Skip Passport configuration when NODE_ENV is "test"
if (process.env.NODE_ENV === 'test') {
    module.exports = () => {};
    return;            // <-- Exit early, nothing below runs
  }
  
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const AppleStrategy = require('passport-apple').Strategy
const UserModel = require('../../models/user_model')
const VendorModel = require('../../models/vendor_model')
require('dotenv').config()

//Local Strategy (username and password)
passport.use(new LocalStrategy(
    {usernameField: 'email', passwordField:'password'},
    async (email,password,done) => {
        try {
            const user = await UserModel.findOne({email});
            if (!user) {
                return done(null,false,{message:'Invalid Credentials'})
            }

            const isMatch = await user.isValidPassword(password)
            if (!isMatch) return done(null,false, {message:"Incorrect password"})
                return done(null,user)
        } catch (error) {
            return done(err)
        }
    }
));

// JWT Strategy (Protect API routes)
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await UserModel.findById(jwtPayload.id);
      console.log("JWT Logged User:", user)
     
      if(!user) return done(null,false);
      return done(null,user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const vendor = await VendorModel.findById(jwtPayload.id)
      console.log("JWT Logged Vendor:", vendor)

      if (!vendor) return done(null,false);

      return done(null,vendor);
    
    } catch (err) {
      return done(err);
    }
  }));

//Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
},async (accessToken,refreshToken,profile,done) => {
    try {
        let user = await UserModel.findOne({googleId:profile.id});

        if (!user) {
            user = await UserModel.create({
                googleId:profile.id,
                first_name:profile.name.givenName,
                last_name:profile.name.familyName,
                email:profile.emails[0].value,
            });
        }
        return done(null,user);  
    } catch (error) {
        return done(err);
    }
}));

//Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
},async (accessToken,refreshToken,profile,done) => {
    try {
        let vendor = await VendorModel.findOne({googleId:profile.id});

        if (!vendor) {
            vendor = await VendorModel.create({
                googleId:profile.id,
                first_name:profile.name.givenName,
                last_name:profile.name.familyName,
                email:profile.emails[0].value,
            });
        }
        return done(null,user);
    } catch (error) {
        return done(err);
    }
}));

//Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_APP_ID,
    clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL:"/auth/facebook/callback",
    profileFields:['id','emails','name']
},async (accessToken,refreshToken,profile,done) => {
    try {
        let user = await UserModel.findOne({facebookId:profile.id});

        if(!user){
            user = await UserModel.create({
                facebookId:profile.id,
                first_name:profile.name.givenName,
                last_name:profile.name.familyName,
                email:profile.emails[0].value
            });
        }
        return done(null,user)
    } catch (error) {
        return done(err)
    }
}));

//Apple OAuth Strategy
passport.use(new AppleStrategy({
    clientID:process.env.APPLE_CLIENT_ID,
    teamID:process.env.APPLE_TEAM_ID,
    keyID:process.env.APPLE_KEY_ID,
    privateKeyString:process.env.APPLE_PRIVATE_KEY,
    callbackURL:'/auth/apple/callback'
},async(accessToken,refreshToken,idToken,profile,done) => {
    try {
        let user = await UserModel.findOne({appleId:profile.id});

        if (!user) {
            user = await UserModel.create({
                appleId:profile.id,
                email:profile.email,
            });
        }
        return done(null,user)
    } catch (error) {
        return done(err);
    }
}));

//Serialize and Deserialize user
passport.serializeUser((user,done) => done(null,user.id));
passport.serializeUser((vendor,done) => done(null,vendor.id))
passport.deserializeUser(async (id,done) => {
    try {
        const user = await UserModel.findById(id);
        done(null,user)
    } catch (error) {
        done(error);
    } 
});
passport.deserializeUser(async (id,done) => {
    try {
        const vendor = await VendorModel.findById(id);
        done(null,vendor)
    } catch (error) {
        done(error);
    } 
});

module.exports = passport