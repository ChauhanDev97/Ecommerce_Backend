const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },

  description: {
    type: String,
    required: true,
    maxlength: 200
  },

  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32
  },

  category: {
    type: ObjectId,
    ref: 'category',
    required: true
  },

  quantity: {
    type: Number
  },

  sold: {
    type: Number,
    default: 0
  },

  photo: {
    data: Buffer,
    contentType: String
  },

  shipping: {
    required: false,
    type: Boolean
  },

  date: {
    type: Date,
    default: new Date()
  }
}, { timestamps: true })

module.exports = mongoose.model('product', productSchema)