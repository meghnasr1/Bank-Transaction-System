const userModel = require("../models/user.model")
const tokenBlackListModel = require("../models/blacklist.model")
const jwt = require("jsonwebtoken");


//we are creating a middleware which will check for the account request creation and all the request is comming from valid user or not for this we will check the token 
// token can be in cookies or header we will check in both if not then not a valid user

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({
            message: " unauthorized access , token is missing ,This is not a valid user",
            status:"not valid user"
    })
    }
    const isBlackListToken = await tokenBlackListModel.findOne({
      token
    })
    if (isBlackListToken) {
        return res.status(401).status({
            message:"Unauthorized access , token is invalid"
        })
    }

    try {
        // in decode the data u gave when creating user all that will come
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decode.userId); // if we find valid token then find user associated with that token
        req.user = user
        return next();
        
    } catch (err) {
        return res.status(401).json({
            message:"Unauthorized access , token is invalid"
        })
    }
}
// 403 is forbidden access
async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: " unauthorized access , token is missing ,This is not a valid user",
            status: "not valid user"
        })
    }
const isBlackListToken = await tokenBlackListModel.findOne({
      token
    })
    if (isBlackListToken) {
        return res.status(401).status({
            message:"Unauthorized access , token is invalid"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decode.userId).select("+systemUser"); // if we find valid token then find user associated with that token
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbiddden access , not a system user"
            })
        }
        req.user = user;
        return next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access , token is invalid"
        })
    }
}
module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}