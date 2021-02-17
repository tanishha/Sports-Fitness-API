const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    //db modelling
    name: {
        type: String,
        required: true
    },
     username: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true

    },

    role: {
        type: Number, //1for admin 2 for end user
        default: 2
    },
    status: {
        type: Boolean,
        default: true
    },
    passwordResetExpiry:Date

}, {
    timestamps: true
})

const UserModel = mongoose.model('user', UserSchema); //here model is method jasko first argument is collection ko name ani second argument is schema

module.exports = UserModel;