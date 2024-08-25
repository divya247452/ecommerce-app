const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const dotenv = require('dotenv')
dotenv.config()

const protect = async (req, res, next) => {
    let token;
    
    // read the JWT from cookie
    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch (error) {
            res.status(401)
            .json({message: "Not Authorised, token failed"})
        }
    } else {
        res.status(401)
        .json({message: "Not Authorised, no token"})
    }
}


const admin = async(req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else {
        res.status(401)
        .json({message: "Not Authorised, as admin "})
    }
}


module.exports = {
    protect,
    admin
}