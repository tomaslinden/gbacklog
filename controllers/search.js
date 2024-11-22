var ObjectId = require('mongoose').Types.ObjectId;
const searchRouter = require('express').Router()
const Subject = require('../models/subject')
const Framework = require('../models/framework')
const Review = require('../models/review')

searchRouter.get('/', async (request, response) => {

    const searchTerm = request?.query?.searchTerm.trim() ?? ''
 

    // Subjects
    let subjectFieldsToSearch = [
        {'name': { $regex : new RegExp(searchTerm, "i") }},
        {'description': { $regex : new RegExp(searchTerm, "i") }}
    ]
    if (searchTerm.length === 24) {
        subjectFieldsToSearch.push({ '_id': new ObjectId(searchTerm) })
    }

    const subjects = await Subject.find(
        { $or: subjectFieldsToSearch }
    )


    // Frameworks
    let frameworkFieldsToSearch = [
        {'name': { $regex : new RegExp(searchTerm, "i") }},
        {'description': { $regex : new RegExp(searchTerm, "i") }},
        {'facets.name': { $regex : new RegExp(searchTerm, "i") }},
        {'facets.description': { $regex : new RegExp(searchTerm, "i") }},
        {'facets.handle': searchTerm }
    ]
    if (searchTerm.length === 24) {
        frameworkFieldsToSearch.push({ '_id': new ObjectId(searchTerm) })
    }

    const frameworks = await Framework.find(
        { $or: frameworkFieldsToSearch }
    )


    // Reviews
    let reviewFieldsToSearch = [
        {'facetContents.contents': { $regex : new RegExp(searchTerm, "i") }},
    ]
    if (searchTerm.length === 24) {
        reviewFieldsToSearch.push({ '_id': new ObjectId(searchTerm) })
    }

    const reviews = await Review.find(
        { $or: reviewFieldsToSearch }
    )


    response.json({
        subjects, frameworks, reviews
    })
})

module.exports = searchRouter
