const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

// connect to Mongo DB
mongoose.set('strictQuery', false)
const url = config.MONGODB_URL
logger.info('connection to', url)
mongoose.connect(url)
    .then(result => {
        logger.info('success -- connecting to MongoDB')
    })
    .catch(error => {
        logger.error('failed -- connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(
    '/api/blogs', 
    middleware.tokenExtractor, 
    middleware.userExtractor, 
    blogRouter
)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app