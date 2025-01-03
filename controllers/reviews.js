const reviewsRouter = require('express').Router()
const Subject = require('../models/subject')
const Review = require('../models/review')
const Framework = require('../models/framework')
var mongoose = require('mongoose')

reviewsRouter.get('/', async (request, response) => {
    let queryObject = {}
    // Todo add a mechanism for getting flagged objects for future admin users
    queryObject.flagged = false

    const reviews = await Review
        .find(queryObject)
        .populate('reviewFramework')
        .populate('subjectTarget')
        .populate('frameworkTarget')
        .populate('reviewTarget')
        .exec()

    response.json(reviews)
})

reviewsRouter.get('/:id', async (request, response, next) => {
    // Todo add mechanism for not displaying flagged items (if not admin user)
    if (!request.params.id || request.params.id === 'undefined') {
        return response.status(400).json({ error: 'request id missing' })
    }

    const review = await Review
        .findById(request.params.id)
        .populate('reviewFramework')
        .populate('subjectTarget')
        .populate('frameworkTarget')
        .populate('reviewTarget')
        .exec()
    
    response.json(review)
})

reviewsRouter.get('/framework/:reviewFrameworkId/:targetType/:targetId', async (request, response, next) => {
    let queryObject = {}
    // Todo add a mechanism for getting flagged objects for future admin users
    queryObject.flagged = false

    const { Types: { ObjectId: { createFromHexString } } } = mongoose

    const reviewFrameworkObjectId = createFromHexString(request.params.reviewFrameworkId)
    const reviewTargetObjectId = createFromHexString(request.params.targetId)

    queryObject.reviewFramework = reviewFrameworkObjectId

    if (request.params.targetType === 'subject') {
        queryObject.subjectTarget = reviewTargetObjectId
    } else if (request.params.targetType === 'review') {
        queryObject.reviewTarget = reviewTargetObjectId
    // Framework target
    } else {
        queryObject.frameworkTarget = reviewTargetObjectId
    }

    const reviews = await Review
        .find(queryObject)
        .populate('reviewFramework')
        .populate('subjectTarget')
        .populate('frameworkTarget')
        .populate('reviewTarget')
        .exec()

    response.json(reviews)
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

    if (reviewFramework?.verdictType &&
        reviewFramework?.verdictType !== 'none' &&
        body.verdictValue === undefined) {
        return response.status(400).json({ error: 'verdictValue missing' })
    }

    let subjectTarget;
    let frameworkTarget;
    let reviewTarget;

    if (body.targetType === 'subject') {
        subjectTarget =
            await Subject.findById(body.targetId)
                .catch(error => next(error))
    } else if (body.targetType === 'review') {
        reviewTarget =
            await Review.findById(body.targetId)
                .catch(error => next(error))
    // Target is a framework
    } else {
        frameworkTarget =
            await Framework.findById(body.targetId)
                .catch(error => next(error))
    }

    let reviewObject = {
        reviewFramework,
        targetType: body.targetType,
        subjectTarget,
        frameworkTarget,
        reviewTarget,
        facetContents: body.facetContents
    }

    if (body?.verdictValue !== undefined) {
        reviewObject.verdictValue = body.verdictValue
    }

    const review = new Review(reviewObject)

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
        await Framework.findById(frameworkId)
        .catch(error => next(error))
    
    let subjectTarget;
    let frameworkTarget;

    if (targetType === 'subject') {
        subjectTarget =
            await Subject.findById(targetId)
                .catch(error => next(error))
    // Target is a framework
    } else {
        frameworkTarget =
            await Framework.findById(targetId)
                .catch(error => next(error))
    }
            
    Review.findByIdAndUpdate(
        request.params.id, 
        { 
            reviewFramework,
            targetType,
            subjectTarget,
            frameworkTarget,
            facetContents
        },
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
