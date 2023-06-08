const Item = require("../models/item");
const mongoose = require('mongoose').default

// returns a 400 client error with specified message (json)
const clientError = (res, message) => res.status(400).json({message})

// returns a 404 not found error with specified message (json)
const notFoundError = (res, message) => res.status(404).json({message})

// check if ID is of valid ObjectId type
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

module.exports = {clientError, notFoundError, isValidId}
