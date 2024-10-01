const jwt = require('jsonwebtoken')
const checkToken = (clientSubmittedToken) => {
    return jwt.verify(clientSubmittedToken, process.env.JWT_SECRET)
}

module.exports = checkToken