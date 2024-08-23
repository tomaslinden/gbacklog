const express = require('express')
const app = express()

const Subject = require('./models/subject')

app.use(express.static('dist'))
app.use(express.json())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Enable CORS if the Gbacklog UI is served from somewhere else
// const cors = require('cors')
// app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/subjects', (request, response) => {
    Subject.find({}).then(subject => {
      response.json(subject)
    })
})

app.post('/api/subjects', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const subject = new Subject({
    name: body.name,
  })

  subject.save().then(savedSubject => {
    response.json(savedSubject)
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
