const express = require('express')
const { getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto } = require('../controllers/userController')
const authController = require('../controllers/authController')

const userRouter = express.Router()

userRouter.post('/signup', authController.signup)
userRouter.post('/login', authController.login)
userRouter.get('/logout', authController.logout)
userRouter.post('/forgotPassword', authController.forgotPassword)
userRouter.patch('/resetPassword/:token', authController.resetPassword)

// Protects all routes after this middleware
userRouter.use(authController.protect)

userRouter.patch('/updateMyPassword', authController.updatePassword)

userRouter.get('/me', getMe, getUser)
userRouter.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
userRouter.delete('/deleteMe', deleteMe)

// Access to all routes after this middleware granted to Admin only
userRouter.use(authController.restrictTo('admin'))

userRouter.route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = userRouter