const express = require('express')
const router = express.Router()
const UserModel = require('./auth.model')
const mapUserReq = require('./../../helpers/mapUserReq');
const jwt = require('jsonwebtoken')
const configs = require('./../../configs')
const passwordHash = require('password-hash')
const nodemailer = require('nodemailer')

function createToken(data) {
    let token = jwt.sign(data, configs.jwtSecret)
    return token
}

const sender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'project87890@gmail.com',
        pass: 'kec@7890',
    },
})

function prepareMail(data) {
    let mailBody = {
            from: '"Sports&Fitness" <noreply@sports&fitness.com>', // sender address
            to: "tanishach203@gmail.com," + data.email, // list of receivers
            subject: "Forgot Password", // Subject line
            text: "Forgot Password?", // plain text body
            html: `<p>Hi ${data.name} !</p>
    <p>Please click <a href="${data.link}">Here </a> to reset your password</p>
    <p>Thank you!</p>
    <p>Kind Regards,</p>
    <p>Sports&Fitness</p>`,
    }
    return mailBody
}

router.post('/login', function (req, res, next) {
    console.log('req.body>>', req.body)
    UserModel
        .findOne({
            username: req.body.username
        })
        .exec(function (err, user) {
            if (err) {
                return next(err)
            }
            if (user) {
                var isPasswordMatch = passwordHash.verify(req.body.password, user.password)
                if (isPasswordMatch) {
                    let token = createToken({
                        _id: user._id,
                        role: user.role
                    })
                    res.json({
                        user,
                        token
                    })
                } else {
                    next({
                        msg: 'Inavlid password',
                        status: 400
                    })
                }
            } else {
                next({
                    msg: "Invalid username",
                    status: 400
                })
            }
        })

})

router.get('/register', function (req, res, next) {
    res.end('from register')
})
router.post('/register', function (req, res, next) {
    const newUser = new UserModel(); //newUser is object
    const newMappedUser = mapUserReq(newUser, req.body)
    newMappedUser.password = passwordHash.generate(req.body.password)
    newMappedUser.save()
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            next({
                    msg: "Username Exists",
                    status: 400
                })
        })


})

router.post('/forgot_password', function(req, res, next) {
    UserModel.findOne({
            email: req.body.email
        })
        .exec(function(err, user) {
            console.log('user>>',user)
            if (err) {
                return next({

                })
            }
            if (!user) {
                return next({
                    msg: 'Email not registered yet',
                    status: 404
                })
            }
            var mailData = {
                name: user.username,
                email: user.email,
                link: `${req.headers.origin}/reset_password/${user._id}`
            }
            var mailContent = prepareMail(mailData)
            console.log('contents>>>>', mailContent)
            
            var passwordResetExpiryTime=Date.now()+(1000*60*60*24) 
            user.passwordResetExpiry=passwordResetExpiryTime

            user.save(function(err,saved){  
                if(err){
                    return next(err)
                }
                sender.sendMail(mailContent, function(err, done) {
                if (err) {
                    return next(err)
                }
                res.json(done)

            })
            })

            
        })
})

router.post('/reset_password/:id', function(req, res, next) {
    UserModel.findOne({
            _id: req.params.id,
            passwordResetExpiry:{
                $gt:Date.now()
            }
        })
        .exec(function(err, user) {
            if (err) {
                return next(err)
            }
            console.log('user is>>>',user)
            if (!user) {
                return next({
                    msg: 'Password reset link expired',
                    status: 404
                })
            }
            user.password = passwordHash.generate(req.body.password)
            user.passwordResetExpiry=null
            user.save(function(err, saved) {
                if (err) {
                    return next(err)
                }
                res.json(saved)
            })
        })
})

module.exports = router