const express = require('express')
const connection = require('./config/database')

const app = express()

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
