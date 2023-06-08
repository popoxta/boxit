const isAuthorized = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.status(401).json({message: 'Please login to view this resource.'})
}

module.exports = {isAuthorized}