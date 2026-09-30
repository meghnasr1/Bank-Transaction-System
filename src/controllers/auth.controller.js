const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
/** 
* -user register controller
* -POST /api/auth/register 
*/

async function userRegisterController(req, res) {
    const { email, password, name } = req.body
    
    const isExist = await userModel.findOne({
        email: email
    })
    if (isExist) {
        return res.status(422).json({
            message: "User already exists with email.",
            status:"failed"
        })
    }
    const user = await userModel.create({
        email,password,name
    })
    // now here we will provide user with jwt token so that user will remain logged in
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn: "3d"})
    //this jwt.sign want payload and secreate key which we can generate 
    res.cookie("token", token)
    res.status(201).json({
        message: "New user is created",
        status: "Success",
        user: {
            _id: user._id,
            email: user.email,
            name:user.name
        },
        token,
    })
    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * 
 * - User Login Controller
 * - POST /api/auth/login
 */


async function userLoginController(req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email }).select("+password") // finding user on the basis of email
    if (!user) { // if we dont find user in the db
        return res.status(401).json({
            message: "Email or password is invalid",
            status:"New user"
        })
    }
    const isvalidPassword = await user.comparePassword(password)
    if (!isvalidPassword) {
        return res.status(401).json({
            message:"Email or password is invalid"
        })
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn: "3d"})
    //this jwt.sign want payload and secreate key which we can generate 
    res.cookie("token", token)
    res.status(200).json({
        message: "New user is created",
        status: "Success",
        user: {
            _id: user._id,
            email: user.email,
            name:user.name
        },
        token,
    })
    
}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}




module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
}