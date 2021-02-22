const jwt = require('jsonwebtoken');
const config = require('./../configs');
const UserModel = require('./../modules/auth/auth.model');
module.exports = function (req, res, next) {
    let token;
    if (req.headers['token'])
        token = req.headers['token']
    if (req.headers['authorization'])
        token = req.headers['authorization']
    if (req.headers['x-access-token'])
        token = req.headers['x-access-token']

    if (token) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                return next(err);
            }
            console.log('decoded value >>', decoded);
            UserModel.findById(decoded._id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    req.loggedInUser = user;
                    next();
                } else {
                    next({
                        msg: "User removed from system",
                        status: 400
                    })
                }
            })

        })
    } else {
        next({
            msg: "Token Not Provided",
            status: 400
        })
    }

}