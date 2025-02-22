const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('bcryptjs')

const register = async(req, res) => {
    const {name, email, password} = req.body

    const user = await User.findOne({email})
    if(user){
        return res.status(500).json({message: 'User already exist !!'})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    if(password.length < 6){
        return res.status(500).json({message: 'Password cannot be less than 6 characters !!'})

    }

    const newUser = await User.create({name, email, password: passwordHash})

    const token = await jwt.sign({id: newUser._id}, "SECRETTOKEN", {expiresIn: "lh"})

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 + 24*60*60*1000)
    }

    res.status(201).cookie("token", token, cookieOptions).json({
        newUser,
        token
    })
}

const login = async(req, res) => {
    
}

const logout = async(req, res) => {
    
}

const forgotPassword = async(req, res) => {
    
}

const resetPassword = async(req, res) => {
    
}

module.exports = {register, login, logout, forgotPassword, resetPassword}