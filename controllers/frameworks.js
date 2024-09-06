const frameworksRouter = require('express').Router()
const Framework = require('../models/framework')

frameworksRouter.get('/', (request, response) => {
    Framework.find({}).then(framework => {
        response.json(framework)
    })
})

// frameworksRouter.get('/:id', (request, response, next) => {
//     Subject.findById(request.params.id).then(framework => {
//         response.json(framework)
//     }).catch(error => next(error))
// })

frameworksRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const framework = new Framework({
        name: body.name,
        description: body.description,
        facets: body.facets
    })

    framework.save().then(savedFramework => {
        response.json(savedFramework)
    }).catch(error => next(error))
})

// frameworksRouter.delete('/:id', (request, response, next) => {
//     Framework.findByIdAndDelete(request.params.id)
//         .then(result => {
//             response.status(204).end()
//         })
//         .catch(error => next(error))
// })

// frameworksRouter.put('/:id', (request, response, next) => {
//     const { name, description, facets } = request.body

//     Framework.findByIdAndUpdate(
//         request.params.id, 
//         { name, description, facets },
//         { new: true, runValidators: true, context: 'query' }
//     ) 
//         .then(updatedFramework => {
//             response.json(updatedFramework)
//         })
//         .catch(error => next(error))
// })

module.exports = frameworksRouter
