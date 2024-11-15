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
  frameworkId: {
    type: String,
    required: true
    // Todo: Enable this once secondary indexes has been understood
    // See https://mongoosejs.com/docs/guide.html#indexes
    // index: true
  },
  facetContents: {
    type: [reviewFacetSchema],
    required: true
  },
  targetType: {
    type: String,
    required: true
  },
  targetId: {
    type: String,
    required: true
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
