const {isAuthorized} = require("../utils/middleware");
const Box = require("../models/box");
const {clientError, isValidId, notFoundError} = require("../utils/utils");
const Item = require("../models/item");
const boxRouter = require('express').Router()

boxRouter.get('/boxes', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user // user id

    const results = await Box.find({user: userId})
    res.json({boxes: results})
})

boxRouter.post('/boxes/new', async (req, res) => {
    const userId = req.session.passport.user

    const hexRegex = new RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i)

    if (!req.body.name) return clientError(res, 'Name must be given.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')
    if (req.body.name.length > 25) return clientError(res, 'Name cannot be longer than 25 characters.')
    if (!hexRegex.test(req.body.hex)) return clientError(res, 'Hex code is invalid.')

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

boxRouter.get('/boxes/:id/items', isAuthorized, async (req, res, next) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    const boxItems = await Item.find({user: userId, box: boxId}).populate('box').exec()
    res.json({items: boxItems})
})

boxRouter.put('/boxes/:id/edit', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    const hexRegex = new RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i)

    if (!req.body.name) return clientError(res, 'Name must be given.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')
    if (req.body.name.length > 25) return clientError(res, 'Name cannot be longer than 25 characters.')
    if (!hexRegex.test(req.body.hex)) return clientError(res, 'Hex code is invalid.')

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

boxRouter.delete('/boxes/:id/delete', isAuthorized, async (req, res) => {
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

boxRouter.get('/boxes/:id', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const boxId = req.params.id

    if (!isValidId(boxId)) return clientError(res, 'Invalid ID.')

    const currBox = await Box.findOne({_id: boxId, user: userId})
    if (!currBox) return notFoundError(res, 'The requested item does not exist.')

    res.json({box: currBox})
})

module.exports = boxRouter
