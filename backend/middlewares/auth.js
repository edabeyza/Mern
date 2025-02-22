const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

// User'ın giriş çıkış yapıp yapmadığını, token'ının olup olmadığını, token'ının geçerli olup olmadığını tespit eden middleware
const authenticationMid = async(req, res, next) => {
    const {token} = req.cookies

    if(!token){
        return res.status(500).json({message: "Please login for access !!"})
    }

    const decodedData = jwt.verify(token, "SECRETTOKEN")

    if(!decodedData){
        return res.status(500).json({message: "Invalid access token !!"})
    }

    req.user = await User.findById(decodedData.id)

    next()
}

// Kişi admin mi değil mi?
const roleChecked = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(500).json({message: "You don't have permission to enter"})
        }
        next()
    }
}

module.exports = {authenticationMid, roleChecked}