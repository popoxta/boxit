const express = require('express')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connection = require('./config/database')
require('dotenv').config()

const app = express()

// MIDDLEWARE //
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
   console.log(`New request at ${req.path} at ${new Date()}`)
    next()
})

// SESSION //
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECT
    }),
    cookie: {
        maxAge: 86400000,
    }
}))

// PASSPORT //
require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res) => res.send('I\'ll end it here.'))

// LAUNCH //
app.listen(3000)
