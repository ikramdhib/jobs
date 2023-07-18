const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError , UnauthenticatedError } = require('../errors')


const register = async(req , res)=>{

    const user = await User.create({...req.body}) 
    const token = user.creatJWT()
    res.status(StatusCodes.CREATED).json({user:{name : user.name}, token })
}


const login = async(req , res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError('emil and password re required' ,500)
    }

    const user = await User.findOne({email})
    //compare pass 
    if(!user){
        throw new UnauthenticatedError('Invalide credentaials',404)
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalide credentaials',404)
    }
    const token = user.creatJWT();

    res.status(StatusCodes.OK).json({user:{name : user.name}, token})

    
}

module.exports ={
    register,
    login
}