const passport = require('passport')
const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// LOGIN ROUTES


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) next({message: `An error has occurred during user login: ${err}`})

        return res.json(info)
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
            res.json({message: 'Registration successful.', success: true})
        })
    } catch (err) {
        next({message: `An error has occurred during user registration: ${err}`
    })
    }
})

router.post('/logout', (req, res) => {
    res.json({message: 'Logout not yet implemented'})
})

module.exports = router