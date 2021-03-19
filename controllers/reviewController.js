const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const { deleteOne,
        updateOne ,
        createOne,
        getOne,
        getAll} = require('./handlerFactory')

const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
}

const getAllReviews = getAll(Review)
const getReview = getOne(Review)
const addReview = createOne(Review)
const updateReview = updateOne(Review)
const deleteReview = deleteOne(Review)

module.exports = { 
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
    setTourUserIds,
    getReview
 }