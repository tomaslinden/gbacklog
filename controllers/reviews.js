const reviewsRouter = require('express').Router()
const Review = require('../models/review')
const Framework = require('../models/framework')

reviewsRouter.get('/', async (request, response) => {
    let queryObject = {}
    // Todo add a mechanism for getting flagged objects for future admin users
    queryObject.flagged = false

    const reviews = await Review
        .find(queryObject)
        .populate('reviewFramework')
        .exec()

    response.json(reviews)
})

reviewsRouter.get('/:id', async (request, response, next) => {
    // Todo add mechanism for not displaying flagged items (if not admin user)
    const review = await Review
        .findById(request.params.id)
        .populate('reviewFramework')
        .exec()
    
    response.json(review)
})

reviewsRouter.post('/', async (request, response, next) => {
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

    const reviewFramework =
        await Framework.findById(body.frameworkId)
        .catch(error => next(error))

    const review = new Review({
        reviewFramework,
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

reviewsRouter.put('/:id', async (request, response, next) => {
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

    const reviewFramework =
        await Framework.findById(body.frameworkId)
        .catch(error => next(error))
    
    Review.findByIdAndUpdate(
        request.params.id, 
        { reviewFramework, targetType, targetId, facetContents },
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedReview => {
            response.json(updatedReview)
        })
        .catch(error => next(error))
})

reviewsRouter.patch('/:id', (request, response, next) => {

    // Todo: Add check that frameworks can only be changed from draft to final

    const { flagged } = request.body

    let fieldsToUpdate = {}

    if (flagged && flagged === true) {
        fieldsToUpdate['flagged'] = true
    }

    Review.findByIdAndUpdate(
        request.params.id, 
        fieldsToUpdate,
        { new: true, runValidators: true, context: 'query' }
    ) 
        .then(updatedReview => {
            response.json(updatedReview)
        })
        .catch(error => next(error))
})


module.exports = reviewsRouter
