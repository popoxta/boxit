const express = require('express')
const router = require('./routes/loginrouter');
const boxRouter = require('./routes/boxrouter')
const itemRouter = require('./routes/itemrouter')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {logger} = require("./utils/middleware");
const connection = require('./config/database')
require('dotenv').config()

const app = express()

// MIDDLEWARE //
app.use(cors({
    origin: true,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(logger)

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
        sameSite: 'none',
        secure: 'auto'
    }
}))

// PASSPORT //
require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())

// ROUTES
app.use(router)
app.use(boxRouter)
app.use(itemRouter)

app.use((err, req, res, next) => {
    if (!err) return
    console.log(`An error has occurred at ${req.path}: ${err}`)
    res.status(500).json({message: 'An unexpected error has occurred.'})
})

// LAUNCH //
app.listen(3000)

