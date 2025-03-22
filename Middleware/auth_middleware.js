const passport = require('passport');

const validateToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user; // Attach user to req
        next();
    })(req, res, next);
};

module.exports = validateToken;
