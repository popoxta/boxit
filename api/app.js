const express = require('express')
const mongoose = require('mongoose').default
require('dotenv').config()

const app = express()

// MONGODB CONN //
const connectionString = process.env.MONGO_CONNECT
const connection = mongoose.connect(connectionString)
    .catch(err => console.log(err))

// MIDDLEWARE //
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
   console.log(`New request at ${req.path} at ${new Date()}`)
    next()
})

app.use((req, res) => res.send('I\'ll end it here.'))

// LAUNCH //
app.listen(3000)
