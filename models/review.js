const mongoose = require('mongoose')
const config = require('../utils/config')

const reviewFacetSchema = new mongoose.Schema({
  handle: {
    type: String,
    minlength: 1,
    maxlength: 50, // Todo: Connect this with the max length validation in create subject
    required: true
  },
  contents: {
    type: String,
    minlength: 1,
    maxlength: 500, // Todo: Connect this with the max length validation in create subject
  },
});

const reviewSchema = new mongoose.Schema({
  reviewFramework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework',
    required: true
  },
  facetContents: {
    type: [reviewFacetSchema],
    required: true
  },
  targetType: {
    type: String,
    required: true
  },
  subjectTarget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  frameworkTarget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework'
  },
  flagged: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

reviewSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Review', reviewSchema)
