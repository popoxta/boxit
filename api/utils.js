const clientError = (res, message) => res.status(400).json({message})

const notFoundError = (res, message) => res.status(404).json({message})

module.exports = {clientError, notFoundError}
