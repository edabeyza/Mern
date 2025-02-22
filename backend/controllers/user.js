const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('bcryptjs')
const cloudinary = require('cloudinary').v2
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const register = async(req, res) => {

    const avatar = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 130,
        crop:"scale"
    })

    const {name, email, password} = req.body

    const user = await User.findOne({email})
    if(user){
        return res.status(500).json({message: 'User already exist !!'})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    if(password.length < 6){
        return res.status(500).json({message: 'Password cannot be less than 6 characters !!'})

    }

    const newUser = await User.create({
        name, 
        email, 
        password: passwordHash,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.secure_url
        }
    })

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
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(500).json({message: 'No such user found !!'})
    }

    const comparePassword = await bcrypt.compare(password, user.password)

    if(!comparePassword){
        return res.status(500).json({message: 'You entered the wrong password !!'})

    }

    const token = await jwt.sign({id: user._id}, "SECRETTOKEN", {expiresIn: "lh"})

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 + 24*60*60*1000)
    }

    res.status(200).cookie("token", token, cookieOptions).json({
        user,
        token
    })
}

const logout = async(req, res) => {
    
    res.status(200).cookie("token", null, cookieOptions).json({
        message: "Logout succesful !!"
    })
}

const forgotPassword = async(req, res) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return res.status(500).json({message: "No such user found !!"})
    }

    const resetToken =  crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000)

    await user.save({validateBeforeSave: false})

    const passwordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`

    const message = `The token you will use to reset your password: ${passwordUrl}`

    try {
        const transporter = nodemailer.createTransport({
            port: 465,
            service: "gmail",
            host: "smtp.gmail.com",
                auth: {
                    user: 'youremail@gmail.com',
                    pass: 'password'
                },
            secure: true
        })

        const mailData = {
            from: 'youremail@gmail.com',
            to: req.body.email,
            subject: 'Password reset',
            text: message
        }

        await transporter.sendMail(mailData)

        res.status(200).json({
            message: "Please check your email !!"
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        res.status(500).json({message: error.message})
    }
}

const resetPassword = async(req, res) => {
    
}

module.exports = {register, login, logout, forgotPassword, resetPassword}