const User = require('../models/User')
const jwt = require ('jsonwebtoken')
const {UnauthenticatedError} =require('../errors')
require('dotenv').config()




const auth = (req , res , next )=>{
    //check header 

    const authHeader = req.headers.authorization

    if(!authHeader || ! authHeader.startsWith('Bearer ')){
    throw new UnauthenticatedError('Authentication invalide')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRETE)
        //atach the user to the job route

        // const user = User.findById(payload.id).select('-password')
        // req.user =user 

        req.user = {userId:payload.userId, name:payload.username}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Unauthorizaton')
    }
   
}

module.exports = auth
