const Item = require("../models/item");
const mongoose = require('mongoose').default

const clientError = (res, message) => res.status(400).json({message})

const notFoundError = (res, message) => res.status(404).json({message})

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

module.exports = {clientError, notFoundError, isValidId}
