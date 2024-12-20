const mongoose = require('mongoose')
const config = require('../utils/config')

const frameworkFacetSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 50, // Todo: Connect this with the max length validation in create subject
    required: true
  },
  handle: {
    type: String,
    minlength: 1,
    maxlength: 50, // Todo: Connect this with the max length validation in create subject
    required: true
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 500, // Todo: Connect this with the max length validation in create subject
  },
});

const frameworkSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 50, // Todo: Connect this with the max length validation in create subject
    required: true
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 500, // Todo: Connect this with the max length validation in create subject
  },
  facets: {
    type: [frameworkFacetSchema],
    required: true
  },
  status: {
    type: String,
    minlength: 1,
    maxlength: 10, // Todo: Connect this with the max length validation in create subject
  },
  flagged: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

frameworkSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Framework', frameworkSchema)
