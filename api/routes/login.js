const passport = require('passport')
const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const isAuthorized = require("../utils");

// LOGIN ROUTES

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {},(err, user, info) => {
        if (err) next({message: `An error has occurred during user login: ${err}`})

        console.log(req.headers)

        req.logIn(user, function (err) {
            if (err) return next({message: `An error has occurred during user ${user.username} login: ${err}`})
            else return res.json(info)
        })
    })(req, res, next)
})

router.post('/register', async (req, res, next) => {
    try {
        // hash password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            const newUser = new User({
                username: req.body.username,
                hash: hashedPassword
            })
            await newUser.save()
            console.log(`New user: ${newUser} created.`)
            res.send({message: 'Registration successful.', success: true})
        })
    } catch (err) {
        next({message: `An error has occurred during user registration: ${err}`
    })
    }
})

router.post('/logout', (req, res, next) => {
    try {
        req.logout()
        res.json({message: 'User logged out.', success: true})
    } catch (err) {
        next({message: `An error has occurred during logout: ${err}`})
    }
})

// BOX ROUTES
router.get('/boxes', isAuthorized, (req, res) => {
    console.log(`Boxes request from ${req.user}`)
    res.json({message: 'Your boxes are here'})
})


module.exports = router