//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let custumError = {
    //set default 
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Somethiong went wrong try again'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.name==='ValidationError'){

    custumError.msg= Object.values(err.errors).map((item)=>item.message)
    .join(',')
    custumError.statusCode=400

  }

  if(err.code && err.code=== 11000){
    custumError.msg =`duplicate value for ${Object.values(err.keyValue)}`
    custumError.statusCode=400
  }

  if(err.name == 'CastError'){
    custumError.msg=`NO item with the id : ${err.value}`
    custumError.statusCode =404
  }
 // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(custumError.statusCode).json({ msg:custumError.msg })
}

module.exports = errorHandlerMiddleware
