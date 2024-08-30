const express = require('express')
const config = require('./utils/config')
// const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const subjectsRouter = require('./controllers/subjects')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// app.use(cors())
app.use(express.static('dist'))
// Enable CORS if the Gbacklog UI is served from somewhere else
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use('/api/subjects', subjectsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
