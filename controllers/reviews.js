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
    console.log('body', body)
    if (
        body.frameworkId === undefined ||
        body.subjectId === undefined ||
        body.facetContents === undefined ||
        body.facetContents.length === 0
    ) {
        return response.status(400).json({ error: 'content missing' })
    }

    const review = new Review({
        frameworkId: body.frameworkId,
        subjectId: body.subjectId,
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
    const { frameworkId, subjectId, facetContents } = request.body

    Review.findByIdAndUpdate(
        request.params.id, 
        { frameworkId, subjectId, facetContents },
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
