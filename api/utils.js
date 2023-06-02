const clientError = (res, message) => res.status(400).json({message})

module.exports = {clientError}
