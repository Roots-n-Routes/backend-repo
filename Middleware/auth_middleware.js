const passport = require('passport');

const validateToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user,info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) {
            console.log("JWT Authentication failed:", info);
            return res.status(401).json({ message: "Unauthorized" });
        }
        // if (!vendor) {
        //     console.log("JWT Authentication failed:", info);
        //     return res.status(401).json({ message: "Unauthorized" });
        // }
        // console.log("Authenticated User:", vendor);
        req.user = user;
        //req.vendor = vendor;
        next();
    })(req, res, next);
};

const validateVendor = (req,res,next) =>{
    passport.authenticate('jwt', { session: false }, (err, vendor, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!vendor) return res.status(401).json({ message: "Unauthorized" });

        req.vendor = vendor // Attach user to req
        console.log("User from JWT:", vendor);
        next();
    })(req, res, next);
}

module.exports = {validateToken,validateVendor};
