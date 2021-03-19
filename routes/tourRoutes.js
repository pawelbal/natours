const express = require('express')
const { getAllTour,
    getTour,
    addTour,
    updateTour,
    deleteTour,
    aliasTopTour,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages
} = require('../controllers/tourController')
const authController = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')

const tourRouter = express.Router()

tourRouter.use('/:tourId/reviews', reviewRouter)

tourRouter.route('/top-5').get(aliasTopTour, getAllTour)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan/:year').get(
    authController.protect, 
    authController.restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan
)

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances)

tourRouter.route('/')
    .get(getAllTour)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        addTour
    )

tourRouter.route('/:id')
    .get(getTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        deleteTour
    )

module.exports = tourRouter