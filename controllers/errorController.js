const AppError = require("../utils/appError")

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

    const message = `Duplicate field value: ${value}. Please change name!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => {
    return new AppError('Invalid token. Please login again', 401)
}

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please log in again!')
}

const sendErrorDev = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    
}

const sendErrorProd = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
        if(err.isOperational){
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })  
    }
    if(err.isOperational){
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);

        if (err.name == 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err)
        if (err.name == 'ValidationError') error = handleValidationErrorDB(err)
        if (err.name === 'JsonWebTokenError') error = handleJWTError()
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError()
        sendErrorProd(error, req, res);
    }
}