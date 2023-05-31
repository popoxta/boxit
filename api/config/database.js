const mongoose = require('mongoose').default
require('dotenv').config()

// MONGODB CONN //
const connectionString = process.env.MONGO_CONNECT
const connection = mongoose.connect(connectionString)
    .catch(err => console.log(err))

module.exports = connection