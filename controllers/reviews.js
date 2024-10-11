const reviewsRouter = require('express').Router()
const Review = require('../models/review')

reviewsRouter.get('/', (request, response) => {
    Review.find({}).then(review => {
        response.json(review)
    })
})

reviewsRouter.get('/:id', (request, response, next) => {
    Review.findById(request.params.id).then(review => {
        response.json(review)
    }).catch(error => next(error))
})

reviewsRouter.post('/', (request, response, next) => {
    const body = request.body

    if (
        body.frameworkId === undefined ||
        body.targetType === undefined ||
        body.targetId === undefined ||
        body.facetContents === undefined ||
        body.facetContents.length === 0
    ) {
        return response.status(400).json({ error: 'content missing' })
    }

    const review = new Review({
        frameworkId: body.frameworkId,
        targetType: body.targetType,
        targetId: body.targetId,
        facetContents: body.facetContents
    })

    review.save().then(savedReview => {
        response.json(savedReview)
    }).catch(error => next(error))
})

reviewsRouter.delete('/:id', (request, response, next) => {
    Review.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

reviewsRouter.put('/:id', (request, response, next) => {
    const { frameworkId, targetType, targetId, facetContents } = request.body

    if (
        frameworkId === undefined ||
        targetType === undefined ||
        targetId === undefined ||
        facetContents === undefined ||
        facetContents.length === 0
    ) {
        return response.status(400).json({ error: 'content missing' })
    }

    Review.findByIdAndUpdate(
        request.params.id, 
        { frameworkId, targetType, targetId, facetContents },
        { new: true,
            runValidators: true, 
            context: 'query' }
    ) 
        .then(updatedReview => {
            response.json(updatedReview)
        })
        .catch(error => next(error))
})

module.exports = reviewsRouter
