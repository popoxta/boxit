const {clientError} = require('./utils')

const isAuthorized = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.status(401).json({message: 'Please login to view this resource.'})
}

const validateItem = async (req, res, next ) => {
    const count = Number(req.body.count)
    const price = Number(req.body.price)

    if (req.file){
        if (req.file.size > 10000) return clientError(res, 'File must be under 10MB.')
        if (!(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.body.contentType)) return {message: 'File type must be of image type.'}
    }
    if (!req.body.name || req.body.count == null || req.body.price == null || !req.body.description || !req.body.box) return clientError(res, 'All fields must be filled out.')
    if (req.body.name.length < 3) return clientError(res, 'Name must be at least 3 characters.')
    if (req.body.description.length < 3) return clientError(res, 'Description must be at least 3 characters.')
    if (typeof count !== 'number' || isNaN(count)) return clientError(res, 'Count must be a numerical.')
    if (typeof price !== 'number'|| isNaN(price)) return clientError(res, 'Price must be a numerical.')

    next()
}

module.exports = {isAuthorized, validateItem}