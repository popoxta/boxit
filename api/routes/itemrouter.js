const {isAuthorized, validateItem} = require("../utils/middleware");
const Item = require("../models/item");
const multerHandleUpload = require("../config/multer");
const {clientError, isValidId, notFoundError} = require("../utils/utils");
const itemRouter = require('express').Router()


itemRouter.get('/items', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user

    const results = await Item.find({user: userId}).populate('box').exec()
    res.json({items: results})
})

itemRouter.post('/items/new', isAuthorized, multerHandleUpload.single('image'), validateItem , async (req, res) => {
    const userId = req.session.passport.user

    const nameIsTaken = await Item.findOne({user: userId, box: req.body.box, name: req.body.name})
    if (nameIsTaken) return clientError(res, 'Item with that name already exists.')

    const newItem = new Item({
        name: req.body.name,
        count: Number(req.body.count),
        price: Number(req.body.price),
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

itemRouter.put('/items/:id/edit', isAuthorized, multerHandleUpload.single('image'), validateItem ,async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    if (!isValidId(itemId)) return clientError(res, 'Invalid ID.')

    const nameIsTaken = await Item.findOne({_id: {$ne: itemId}, user: userId, box: req.body.box, name: req.body.name})
    if (nameIsTaken) return clientError(res, 'Item with that name already exists.')

    const updatedItem = new Item({
        _id: itemId,
        name: req.body.name,
        count: Number(req.body.count),
        price: Number(req.body.price),
        description: req.body.description,
        box: req.body.box,
    })
    if (req.file) updatedItem.image = {
        data: req.file.buffer,
        contentType: req.body.contentType
    }

    const result = await Item.findOneAndUpdate({_id: itemId, user: userId}, updatedItem, {new: true}).populate('box').exec()
    if (!result) return notFoundError({message: 'Item could not be found.'})
    return res.json({item: result})
})

itemRouter.delete('/items/:id/delete', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    if (!isValidId(itemId)) return clientError(res, 'Invalid ID.')

    const result = await Item.findOneAndRemove({_id: itemId, user: userId})
    if (!result) return notFoundError(res, {message: 'Item could not be found.'})
    else res.json({item: result})
})

itemRouter.get('/items/:id', isAuthorized, async (req, res) => {
    const userId = req.session.passport.user
    const itemId = req.params.id

    if (!isValidId(itemId)) return clientError(res, 'Invalid ID.')

    const currItem = await Item.findOne({_id: itemId, user: userId}).populate('box').exec()
    if (!currItem) return notFoundError(res, 'The requested item does not exist.')
    else res.json({item: currItem})
})

module.exports = itemRouter
