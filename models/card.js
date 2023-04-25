const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      jobType: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      jobLink: {
        type: String,
        required: true
      },
      batch: {
        type: Number,
        required: true
      }
})

const Card = mongoose.model('Card', cardSchema)
module.exports = Card;
