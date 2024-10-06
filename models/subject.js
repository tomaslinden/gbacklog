const mongoose = require('mongoose')
const config = require('../utils/config')

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 100, // Todo: Connect this with the max length validation in create subject
    required: true
  },
}, { timestamps: true })

subjectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Subject', subjectSchema)
