const mongoose = require('mongoose').default

const ItemSchema = new mongoose.Schema({
    image: {data: Buffer, contentType: String},
    name: {type: String, required: true},
    count: {type: Number, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    box: {type: mongoose.Types.ObjectId, required: true},
    user: {type: mongoose.Types.ObjectId, required: true},
})

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item