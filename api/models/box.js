const mongoose = require('mongoose').default

const BoxSchema = new mongoose.Schema({
    name: {type: String, required: true},
    hex: String,
    user: {type: mongoose.Types.ObjectId, required: true},
})

const Box = mongoose.model('Box', BoxSchema)

module.exports = Box