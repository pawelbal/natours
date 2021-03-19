const express = require('express')
const morgan = require('morgan')
const path = require('path')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const viewRouter = require('./routes/viewRoutes')
const cookieParser = require('cookie-parser')
const csp = require('express-csp')
const compression = require('compression')
const cors = require('cors')

// Start express app
const app = express()

app.enable('trust proxy')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// GLOBAL MIDDLEWARES
// implement CORS
app.use(cors())

app.options('*'. cors())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Security HTTP headers
// app.use( helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],
 
//       baseUri: ["'self'"],
 
//       fontSrc: ["'self'", 'https:', 'data:'],
 
//       scriptSrc: ["'self'", 'https://*.cloudflare.com'],
 
//       scriptSrc: ["'self'", 'https://*.stripe.com'],
 
//       scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],
 
//       frameSrc: ["'self'", 'https://*.stripe.com'],
 
//       objectSrc: ["'none'"],
 
//       styleSrc: ["'self'", 'https:', 'unsafe-inline'],
 
//       workerSrc: ["'self'", 'data:', 'blob:'],
 
//       childSrc: ["'self'", 'blob:'],
 
//       imgSrc: ["'self'", 'data:', 'blob:'],
 
//       connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
 
//       upgradeInsecureRequests: [],
//     },
//   }))
app.use(helmet());
csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://js.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:8828',
        'ws://localhost:56558/',
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
    },
  },
});


// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP, please try again in an hour!'
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent http parameters polutions
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
    ]
}))

app.use(compression())

// Test middleware
// app.use((req, res, next) => {
//     console.log(req.cookies)
//     next()
// })

// Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)
app.use('/', viewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app