const express = require('express')
const {
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
    setTourUserIds,
    getReview
} = require('../controllers/reviewController')
const authController = require('../controllers/authController')

const reviewRouter = express.Router({ mergeParams: true })

// Protects all routes after this middleware
reviewRouter.use(authController.protect)

reviewRouter.route('/')
.get(getAllReviews)
.post(authController.restrictTo('user'), setTourUserIds, addReview)

reviewRouter.route('/:id')
.delete(authController.restrictTo('user', 'admin'), deleteReview)
.patch(authController.restrictTo('user', 'admin'), updateReview)
.get(getReview)

module.exports = reviewRouter
