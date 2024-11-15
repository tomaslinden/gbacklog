const subjectsRouter = require('express').Router()
const Subject = require('../models/subject')

subjectsRouter.get('/', (request, response) => {
    let queryObject = {}

    if (request?.query?.status) {
        queryObject.status = request.query.status
    }
    // Todo add a mechanism for getting flagged objects for future admin users
    queryObject.flagged = false

    Subject.find(queryObject).then(subject => {
        response.json(subject)
    })
})

subjectsRouter.get('/:id', (request, response, next) => {
    // Todo add mechanism for not displaying flagged items (if not admin user)
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
        status: body?.status ? body.status : 'draft',
        description: body.description
    })

    subject.save().then(savedSubject => {
        response.json(savedSubject)
    }).catch(error => next(error))
})

subjectsRouter.delete('/:id', (request, response, next) => {

    // Todo: Add check that subject is not final (only non-final subjects can be deleted)

    Subject.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

subjectsRouter.put('/:id', (request, response, next) => {

    // Todo: Add check that only non-final subjects can be updated

    const { name, status, description } = request.body

    Subject.findByIdAndUpdate(
        request.params.id, 
        { name, status, description },
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedSubject => {
            response.json(updatedSubject)
        })
        .catch(error => next(error))
})

subjectsRouter.patch('/:id', (request, response, next) => {

    // Todo: Add check that subjects can only be changed from draft to final

    const { status, name, description, flagged } = request.body

    let fieldsToUpdate = {}
    if (status) {
        fieldsToUpdate['status'] = status
    }
    if (name) {
        fieldsToUpdate['name'] = name
    }
    if (description) {
        fieldsToUpdate['description'] = description
    }
    if (flagged && flagged === true) {
        fieldsToUpdate['flagged'] = true
    }

    Subject.findByIdAndUpdate(
        request.params.id, 
        fieldsToUpdate,
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedSubject => {
            response.json(updatedSubject)
        })
        .catch(error => next(error))
})

module.exports = subjectsRouter
