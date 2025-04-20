const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const accessToken =  jwt.sign({id}, 'accessKey', {expiresIn: '3d'})
    const refreshToken =  jwt.sign({id}, 'refreshKey', {expiresIn: '30d'})

    return { accessToken, refreshToken }

}

module.exports = generateToken
