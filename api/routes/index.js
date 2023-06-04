const passport = require('passport')
const router = require('express').Router()
const User = require('../models/user')
const Box = require('../models/box')
const bcrypt = require('bcrypt')
const {clientError, notFoundError} = require('../utils')
const {isAuthorized} = require('../middleware')
const mongoose = require('mongoose').default

// LOGIN ROUTES

router.post('/login', (req, res, next) => {
    if (!req.body.password || !req.body.username) return clientError(res, 'All fields must be filled.')
    if (req.body.password.length < 6) return clientError(res, 'Password must be at least 6 characters.')
    if (req.body.username.length < 3) return clientError(res, 'Username must be at least 3 characters.')

    passport.authenticate('local', {}, (err, user, info) => {
        if (err) return next({message: `An error has occurred during user login: ${err}`})
        if (!user) return res.status(401).json(info)

        req.logIn(user, function (err) {
            if (err) next(err)
            else res.end()
        })
    })(req, res, next)
})

router.post('/register',
    async (req, res, next) => {
        if (!req.body.password || !req.body.passwordConfirm || !req.body.username) return clientError(res, 'All fields must be filled.')
        if (req.body.password.length < 6) return clientError(res, 'Password must be at least 6 characters.')
        if (req.body.username.length < 3) return clientError(res, 'Username must be at least 3 characters.')
        if (req.body.password !== req.body.passwordConfirm) return clientError(res, 'Passwords must match.')

        // check if user with username already exists
        const exists = await User.findOne({username: req.body.username})
        if (exists) return clientError(res, 'User already exists.')

        // hash password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            const newUser = new User({
                username: req.body.username,
                hash: hashedPassword
            })
            await newUser.save()
            console.log(`New user: ${newUser} created.`)
            res.end()
        })
    })

router.post('/logout', (req, res) => {
    req.logout()
    res.end()
})

router.get('/profile', isAuthorized, (req, res) => {
    res.json({username: req.user.username})
})

// BOX ROUTES
router.get('/boxes', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user // user id
    console.log(`Boxes request from ${req.user.username}, id: ${userId}`)

    const results = await Box.find({user: userId})

    res.json({boxes: results})
})

router.get('/boxes/:id', isAuthorized, async (req, res) =>{
    const userId = req.session.passport.user
    const boxId = req.params.id

    console.log(`Boxes request for box: ${boxId} from user ${req.user.username}`)

    // check if ID is of valid ObjectId type
    const isValidId = mongoose.Types.ObjectId.isValid(boxId)
    if (!isValidId) return clientError(res, 'Invalid ID.')

    const currBox = await Box.findOne({_id: boxId, user: userId})
    if (!currBox) return notFoundError(res, 'The requested item does not exist.')

    res.json(currBox)

})

module.exports = router