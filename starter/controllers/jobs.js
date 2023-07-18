 const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const{BadRequestError, NotFoundError} = require('../errors')
const User = require('../models/User')


const getJob = async(req , res)=>{

    const jobs = await Job.find({createdBy:req.user.userId})
    .sort('creat')

    res.status(StatusCodes.OK).json({jobs , count:jobs.length})

}
const getOneJob = async(req , res)=>{

    const {
        user:{userId},
        params:{id:id}} =req 


    const job = await Job.findOne({
        _id:id,
        createdBy:userId
    })

    if(!job){
        throw new NotFoundError(`job not found with the id : ${id}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createjOB = async(req , res)=>{

    req.body.createdBy= req.user.userId

    const job = await Job.create(req.body)
 
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req , res)=>{
    const {
        body:{company,position},
        user:{userId},
        params:{id:id}} =req 


        if(company=='' || position===''){
            throw new BadRequestError('company or position could not be emty')

        }

    const job = await Job.findByIdAndUpdate({
        _id:id,
        createdBy:userId,},
        req.body,
        {new:true , runValidators:true}
    )

    if(!job){
        throw new NotFoundError(`job not found with the id : ${id}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req , res)=>{

    const {
        user:{userId},
        params:{id:id}
    } =req 


    const job = await Job.findByIdAndRemove({
        _id:id,
        createdBy:userId
    })

    if(!job){
        throw new NotFoundError(`job not found with the id : ${id}`)
    }

    res.status(StatusCodes.OK).send()
}



module.exports ={
    getJob,
    getOneJob,
    createjOB,
    updateJob,
    deleteJob
}