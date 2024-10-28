const jwt = require('jsonwebtoken')
const checkToken = (clientSubmittedToken) => {
    try {
        return jwt.verify(clientSubmittedToken, process.env.JWT_SECRET)
    } catch (error) {
        console.error(error)
        return false
    }
}

module.exports = checkToken
