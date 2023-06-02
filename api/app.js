const express = require('express')
const router= require('./routes/index');
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connection = require('./config/database')
require('dotenv').config()

const app = express()

// MIDDLEWARE //
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())

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
app.use((req, res, next) => {
    console.log(`New request at ${req.path} at ${new Date()}`)
    next()
})

app.use(router)

app.use((err, req, res, next) => {
    if (!err) return
    console.log(`An error has occurred at ${req.path}: ${err}`)
    res.status(500).json({message: 'An unexpected error has occurred.'})
})

// LAUNCH //
app.listen(3000)
