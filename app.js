const express = require('express')
// const cors = require('cors')

const app = express()

const Subject = require('./models/subject')

app.use(express.static('dist'))
// Enable CORS if the Gbacklog UI is served from somewhere else
// app.use(cors())
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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/subjects', (request, response) => {
    Subject.find({}).then(subject => {
      response.json(subject)
    })
})

app.get('/api/subjects/:id', (request, response, next) => {
    Subject.findById(request.params.id).then(subject => {
        response.json(subject)
    }).catch(error => next(error))
})

app.post('/api/subjects', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const subject = new Subject({
        name: body.name,
    })

    subject.save().then(savedSubject => {
        response.json(savedSubject)
    }).catch(error => next(error))
})

app.delete('/api/subjects/:id', (request, response, next) => {
  Subject.findByIdAndDelete(request.params.id)
      .then(result => {
          response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/subjects/:id', (request, response, next) => {
    const { name } = request.body

    Subject.findByIdAndUpdate(
        request.params.id, 
        { name },
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedSubject => {
          response.json(updatedSubject)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
