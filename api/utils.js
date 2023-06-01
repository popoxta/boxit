
const isAuthorized = (req, res, next) => {
    if (req.isAuthenticated()) next()
    else res.status(401).json({message: 'Please login to view this resource.', success: false})
}

module.exports = isAuthorized
