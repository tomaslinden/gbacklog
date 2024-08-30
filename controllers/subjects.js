const subjectsRouter = require('express').Router()
const Subject = require('../models/subject')

subjectsRouter.get('/', (request, response) => {
    Subject.find({}).then(subject => {
        response.json(subject)
    })
})

subjectsRouter.get('/:id', (request, response, next) => {
    Subject.findById(request.params.id).then(subject => {
        response.json(subject)
    }).catch(error => next(error))
})

subjectsRouter.post('/', (request, response, next) => {
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

subjectsRouter.delete('/:id', (request, response, next) => {
    Subject.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

subjectsRouter.put('/:id', (request, response, next) => {
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

module.exports = subjectsRouter
