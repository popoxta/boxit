const router = require('express').Router()
const User = require('../models/user')

// LOGIN ROUTES

router.post('/login', (req, res) => {
    console.log(req.body)
    res.json({message: 'Login not yet implemented'})
})

router.post('/register', async (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) return res.json({message: 'An unexpected error has occurred.'})

            const newUser = new User({
                username: req.body.username,
                hash: hashedPassword
            })
            await newUser.save()
            res.redirect('/boxes')
        })
    } catch (err) {
        res.json({message: 'A registration error has occurred.'})
    }

})

router.post('/logout', (req, res) => {
    res.json({message: 'Logout not yet implemented'})
})

module.exports = router