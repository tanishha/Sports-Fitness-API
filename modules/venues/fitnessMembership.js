var mongoose = require("mongoose");
 var Fitness= require('./fitness.model')
var membershipSchema = new mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    requirements:String,
    contact:Number,
    VenueId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Fitness"

    }

});
var Fitness_Membership = mongoose.model("fitness_Membership", membershipSchema);

module.exports = Fitness_Membership;

