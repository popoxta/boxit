const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// LOGIN ROUTES

router.post('/login', (req, res) => {
    console.log(req.body)
    res.json({message: 'Login not yet implemented', success: false})
})

router.post('/register', async (req, res) => {

    try {
        // hash password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) return res.json({message: 'An unexpected error has occurred.', success: false})

            const newUser = new User({
                username: req.body.username,
                hash: hashedPassword
            })

            await newUser.save()
            console.log(`New user: ${newUser} created.`)
            res.json({message: 'Registration successful.', success: true})
        })
    } catch (err) {
        console.log(`An error has occurred during user registration: ${err}`)

        res.json({message: 'A registration error has occurred.', success: false})
    }
})

router.post('/logout', (req, res) => {
    res.json({message: 'Logout not yet implemented'})
})

module.exports = router