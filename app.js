const express = require('express')
const config = require('./utils/config')
// const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const app = express()

const subjectsRouter = require('./controllers/subjects')
const frameworksRouter = require('./controllers/frameworks')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Enable CORS if the Gbacklog UI is served from somewhere else
// app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/subjects', subjectsRouter)
app.use('/api/frameworks', frameworksRouter)

const { unknownEndpoint, errorHandler } = middleware;
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
