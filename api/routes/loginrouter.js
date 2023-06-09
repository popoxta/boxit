const passport = require('passport')
const router = require('express').Router()
const User = require('../models/user')
const Box = require('../models/box')
const Item = require('../models/item')
const bcrypt = require('bcrypt')
const {clientError, notFoundError, isValidId} = require('../utils/utils')
const {isAuthorized, validateItem} = require('../utils/middleware')
const multerHandleUpload = require('../config/multer')

// LOGIN ROUTES
router.post('/login', (req, res, next) => {
    if (!req.body.password || !req.body.username) return clientError(res, 'All fields must be filled.')
    if (req.body.password.length < 6) return clientError(res, 'Password must be at least 6 characters.')
    if (req.body.username.length < 3) return clientError(res, 'Username must be at least 3 characters.')

    // attempt to authenticate user
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

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err)
        else res.end()
    })
})

router.get('/profile', isAuthorized, (req, res) => {
    res.json({username: req.user.username})
})

module.exports = router