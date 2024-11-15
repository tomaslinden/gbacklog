const frameworksRouter = require('express').Router()
const Framework = require('../models/framework')

frameworksRouter.get('/', (request, response) => {
    let queryObject = {}
    if (request?.query?.status) {
        queryObject.status = request.query.status
    }
    // Todo add a mechanism for getting flagged objects for future admin users
    queryObject.flagged = false

    Framework.find(queryObject).then(framework => {
        response.json(framework)
    })
})

frameworksRouter.get('/:id', (request, response, next) => {
    // Todo add mechanism for not displaying flagged items (if not admin user)
    Framework.findById(request.params.id).then(framework => {
        response.json(framework)
    }).catch(error => next(error))
})

frameworksRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const framework = new Framework({
        name: body.name,
        description: body.description,
        facets: body.facets,
        status: body?.status ? body.status : 'draft'
    })

    framework.save().then(savedFramework => {
        response.json(savedFramework)
    }).catch(error => next(error))
})

frameworksRouter.delete('/:id', (request, response, next) => {

    // Todo: Add check that subject is not final (only non-final subjects can be deleted)

    Framework.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

frameworksRouter.put('/:id', (request, response, next) => {

    // Todo: Add check that only non-final subjects can be updated

    const { name, description, facets, status } = request.body

    Framework.findByIdAndUpdate(
        request.params.id, 
        { name, description, facets, status },
        { new: true,
            runValidators: true, 
            context: 'query' }
    ) 
        .then(updatedFramework => {
            response.json(updatedFramework)
        })
        .catch(error => next(error))
})

frameworksRouter.patch('/:id', (request, response, next) => {

    // Todo: Add check that frameworks can only be changed from draft to final

    const { status, name, flagged } = request.body

    let fieldsToUpdate = {}
    if (status) {
        fieldsToUpdate['status'] = status
    }

    if (flagged && flagged === true) {
        fieldsToUpdate['flagged'] = true
    }

    Framework.findByIdAndUpdate(
        request.params.id, 
        fieldsToUpdate,
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedFramework => {
            response.json(updatedFramework)
        })
        .catch(error => next(error))
})

module.exports = frameworksRouter
