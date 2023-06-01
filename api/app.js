const express = require('express')
const router = require('./routes/login.js');
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connection = require('./config/database')
require('dotenv').config()

const app = express()

// MIDDLEWARE //
app.use(cors()) //todo better policies
app.use(express.json())

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

// ROUTES
app.use(router)

// LAUNCH //
app.listen(3000)
