const express = require('express')
const app = express()

const Subject = require('./models/subject')

app.use(express.static('dist'))
app.use(express.json())

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

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
