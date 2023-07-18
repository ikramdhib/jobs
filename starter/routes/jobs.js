const express = require('express')

const router = express.Router()


const {
    getJob,
    getOneJob,
    createjOB,
    updateJob,
    deleteJob
}               = require('../controllers/jobs')


router.route('/').get(getJob).post(createjOB)
router.route('/:id').patch(updateJob).delete(deleteJob).get(getOneJob)


module.exports = router