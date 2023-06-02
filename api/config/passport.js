const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    async (username, password, done) => {

        // check if user with username exists
        const user = await User.findOne({username})
        if (!user) return done(null, false, {message: 'User does not exist.'})

        // check if password entered correctly
        bcrypt.compare(password, user.hash, (error, valid) => {
            if (valid) return done(null, user)
            else return done(null, false, {message: 'Incorrect password.'})
        })
    }
))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async (userID, done) => {
    try {
        const user = await User.findById(userID)
        done(null, user)

    } catch (err) {
        done(err)
    }
})