const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true,'user must have an username'],
    minlength:3,
    maxlength:50
   } ,
   email:{
    type:String,
    required:[true,'user must have an email'],
    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
'please provide avalid email'],
    unique:true,
   } ,
   password :{
    type:String,
    required:[true,'user must have a password'],
    minlength:8,
   } ,
})

userSchema.pre('save', async function(){
    const slat = await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,slat)
} )

userSchema.methods.creatJWT = function(){
    return jwt.sign({userId:this._id,username:this.name},
        process.env.JWT_SECRETE,{expiresIn:process.env.JWT_LIFETIME})
}

userSchema.methods.comparePassword = async function (pass){
    const isMatch = await bcrypt.compare(pass , this.password)

    return isMatch
}

module.exports=mongoose.model('User',userSchema)