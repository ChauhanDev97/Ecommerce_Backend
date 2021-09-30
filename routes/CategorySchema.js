const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        unique : true
      },

    date: {
        type: Date,
        default: new Date()
    }
}, {timestamps : true})

module.exports = mongoose.model('category', categorySchema)