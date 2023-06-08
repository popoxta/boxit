const passport = require('passport')
const router = require('express').Router()
const User = require('../models/user')
const Box = require('../models/box')
const Item = require('../models/item')
const bcrypt = require('bcrypt')
const {clientError, notFoundError, isValidId} = require('../utils/utils')
const {isAuthorized} = require('../utils/middleware')
const multerHandleUpload = require('../config/multer')
const cors = require('cors')
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

router.get('/items', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    console.log(`Items request from ${req.user.username}, id: ${userId}`)

    const results = await Item.find({user: userId})

    res.json({items: results})
})

// todo dry up these routes

router.post('/boxes/new', async (req, res) => {
    const userId = req.session.passport.user

    if (!req.body.name) return clientError(res, 'Name must be given.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')

    const nameIsTaken = await Box.findOne({name: req.body.name, user: userId})
    if (nameIsTaken) return clientError(res, 'Box with that name already exists.')

    const newBox = new Box({
        name: req.body.name,
        hex: req.body.hex,
        user: userId
    })

    const result = await newBox.save()
    res.json({box: result})
})

router.post('/items/new', isAuthorized, multerHandleUpload.single('image'), async (req, res) => {
    const userId = req.session.passport.user

    const count = Number(req.body.count)
    const price = Number(req.body.price)

    if (req.file){
        if (req.file.size > 10000) return clientError(res, 'File must be under 10MB.')
        if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.body.contentType)) return {message: 'File type must be of image type.'}
    }
    if (!req.body.name || req.body.count == null || req.body.price == null || !req.body.description || !req.body.box) return clientError(res, 'All fields must be filled out.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')
    if (req.body.description.length < 3) return clientError(res, 'Description must be at least 3 characters.')
    if (typeof count !== 'number' || isNaN(count)) return clientError('Count must be a numerical.')
    if (typeof price !== 'number'|| isNaN(price)) return clientError('Price must be a numerical.')

    const nameIsTaken = await Item.findOne({user: userId, box: req.body.box, name: req.body.name})
    if (nameIsTaken) return clientError(res, 'Item with that name already exists.')

    const newItem = new Item({
        name: req.body.name,
        count: count,
        price: price,
        description: req.body.description,
        box: req.body.box,
        user: userId
    })
    if (req.file) newItem.image = {
        data: req.file.buffer,
        contentType: req.body.contentType
    }

    const result = await newItem.save()
    res.json({item: result})
})

router.put('/items/:id/edit', isAuthorized, multerHandleUpload.single('image'), async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    // check if ID is of valid ObjectId type
    if (!isValidId(id)) return clientError(res, 'Invalid ID.')

    const count = Number(req.body.count)
    const price = Number(req.body.price)

    if (req.file){
        if (req.file.size > 10000) return clientError(res, 'File must be under 10MB.')
        if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.body.contentType)) return {message: 'File type must be of image type.'}
    }
    if (!req.body.name || req.body.count == null || req.body.price == null || !req.body.description || !req.body.box) return clientError(res, 'All fields must be filled out.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')
    if (req.body.description.length < 3) return clientError(res, 'Description must be at least 3 characters.')
    if (typeof count !== 'number' || isNaN(count)) return clientError('Count must be a numerical.')
    if (typeof price !== 'number'|| isNaN(price)) return clientError('Price must be a numerical.')

    const nameIsTaken = await Item.findOne({_id: {$ne: itemId}, user: userId, box: req.body.box, name: req.body.name})
    if (nameIsTaken) return clientError(res, 'Item with that name already exists.')

    const updatedItem = new Item({
        _id: itemId,
        name: req.body.name,
        count: count,
        price: price,
        description: req.body.description,
        box: req.body.box,
    })
    if (req.file) updatedItem.image = {
        data: req.file.buffer,
        contentType: req.body.contentType
    }

    const result = await Item.findOneAndUpdate({_id: itemId, user: userId}, updatedItem, {new: true})
    if (!result) return notFoundError({message: 'Item could not be found.'})
    return res.json({item: result})
})

router.delete('/items/:id/delete', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    // check if ID is of valid ObjectId type
    if (!isValidId(itemId)) return clientError(res, 'Invalid ID.')

    const result = await Item.findOneAndRemove({_id: itemId, user: userId})
    if (!result) return notFoundError(res, {message: 'Item could not be found.'})
    else res.json({item: result})
})

router.delete('/boxes/:id/delete', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    // check if ID is of valid ObjectId type
    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    const hasItems = await Item.find({user: userId, box: boxId}, {_id: 1})
    if (hasItems.length > 0) return clientError(res, `Items must be deleted or moved to delete Box.`)

    const result = await Box.findOneAndRemove({_id: boxId, user: userId})
    if (!result) return notFoundError(res, {message: 'Box could not be found.'})
    else res.json({box: result})
})

router.put('/boxes/:id/edit', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    console.log(`Edit request for box: ${boxId} from user ${req.user.username}`)

    // check if ID is of valid ObjectId type
    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    if (!req.body.name) return clientError(res, 'Name must be given.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')

    const nameIsTaken = await Box.findOne({_id: {$ne: boxId}, name: req.body.name, user: userId})
    if (nameIsTaken) return clientError(res, 'Box with that name already exists.')

    const updatedBox = new Box({
        _id: boxId,
        name: req.body.name,
        hex: req.body.hex
    })

    const result = await Box.findOneAndUpdate({_id: boxId, user: userId}, updatedBox, {new: true})
    if (!result) return notFoundError({message: 'Box could not be found.'})
    else res.json({box: result})
})

router.get('/boxes/:id', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    console.log(`Boxes request for box: ${boxId} from user ${req.user.username}`)

    // check if ID is of valid ObjectId type
    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    const currBox = await Box.findOne({_id: boxId, user: userId})
    if (!currBox) return notFoundError(res, 'The requested item does not exist.')

    const itemCount = await Item.count({box: boxId, user: userId})

    res.json({box: currBox, itemCount})
})

router.get('/boxes/:id/items', isAuthorized, async (req, res, next) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    // check if ID is of valid ObjectId type
    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    // returns all items for box
    const boxItems = await Item.find({user: userId, box: boxId})
    res.json({items: boxItems})
})

router.get('/items/:id', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    console.log(`Item request for item: ${itemId} from user ${req.user.username}`)

    // check if ID is of valid ObjectId type
    if (!isValidId(itemId)) return clientError(res, 'Invalid ID.')

    const currItem = await Item.findOne({_id: itemId, user: userId})
    if (!currItem) return notFoundError(res, 'The requested item does not exist.')
    else res.json({item: currItem})
})

module.exports = router