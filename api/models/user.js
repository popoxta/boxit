const mongoose = require('mongoose').default

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
})

const User = mongoose.model('User', UserSchema)

module.exports = User