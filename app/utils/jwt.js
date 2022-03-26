const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const createJwt = ( {payload}) =>{
    const token = jwt.sign(payload,jwtSecret);
    return token;
}

const isTokenValid = ({ token }) => jwt.verify(token, jwtSecret);

module.exports ={
    createJwt,
    isTokenValid
}