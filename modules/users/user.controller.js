const router = require('express').Router();
const UserModel = require('./../auth/auth.model');
const mapUserReq = require('./../../helpers/mapUserReq');

router.route('/')

    .get(function (req, res, next) {
        console.log('req.loggedIN user >>', req.loggedInUser);
        //get all users
        UserModel.find({})
            .sort({
                _id: -1
            })
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }
                res.json(users)
            })
    })
    .post(function (req, res, next) {

    })
router.route('/:id')
    .get(function (req, res, next) {
        //get all users by id
        UserModel.findOne({
                _id: req.params.id
            })
            //UserModel.findbyId(req.params.id)
            .then(function (user) {
                res.json(user)
            })
            .catch(function (err) {
                next(err)
            })
    })

    .put(function (req, res, next) {
        UserModel.findById(req.params.id)
            .then(function (user) {
                if (!user) {
                    return next({
                        msg: 'User Not Found',
                        status: 400
                    })
                }
                //update
                //user==>mongoose object
                const updatedUser = mapUserReq(user, req.body);
                updatedUser.save(function (err, updated) {
                    if (err) {
                        return next(err)
                    }
                    res.json(updated)
                })
            })
            .catch(function (err) {
                next(err)
            })
    })
    .delete(function (req, res, next) {
        console.log('req.loggedIn user>>',req.loggedInUser)
        // if (req.loggedInUser.role !== 1) {
        //     return next({
        //         msg: "you dont have access",
        //         status: 403
        //     })
        // }

        // UserModel.findByIdAndRemove(req.params.id)
        //     .then(function (user) {
        //         res.json(user)
        //     })
        //     .catch(function (err) {
        //         next(err)
        //     })
        //for msg for non existing users
        UserModel.findById(req.params.id)
            .then(function (user) {
                if (user) {
                    user.remove(function (err, removed) {
                        if (err) {
                            return next(err)
                        }
                        res.json(removed)
                    })
                } else {
                    next({
                        msg: 'User not found',
                        status: 404
                    })
                }
            })
            .catch(function (err) {
                next(err)
            })
    })

module.exports = router