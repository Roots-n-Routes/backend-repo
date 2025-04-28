const { error } = require('console');
const crypto = require('crypto')

const verifyflutterWebhook = async(req,res,next) => {
    const hash = req.headers["verif-hash"];
    const secretHash = process.env.FLW_SECRET_HASh;

    if (!hash || hash !== secretHash) {
        return res.status(401).json({error:"Invalid or missing webhook signature"})
    }

    next();
    res.status(200).send('Ok').json({message:"Pending"});
}

module.exports = verifyflutterWebhook;