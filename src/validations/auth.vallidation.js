const { body, param, query, header } = require('express-validator');

module.exports = {
    
    // POST /api/auth/
    login: [
        body('email','Invalid email').isEmail(),
        body('password', 'Invalid password, password should be atleast 8 characters long').isLength({ min: 8 })
    ],
    
}