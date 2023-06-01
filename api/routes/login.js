const router = require('express').Router()

// LOGIN ROUTES

router.post('/login', (req, res) => {
    console.log(req.body)
    res.setHeader()
    res.json({msg: 'Login not yet implemented'})
})

router.post('/register', (req, res) => {
    res.json({msg: 'Register not yet implemented'})
})

router.post('/logout', (req, res) => {
    res.json({msg: 'Logout not yet implemented'})
})

module.exports = router