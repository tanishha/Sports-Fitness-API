var mongoose = require("mongoose");
 var Sports= require('./venue.model')
var membershipSchema = new mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    requirements:String,
    contact:Number,
    VenueId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sports"

    }

});
var Sports_Membership = mongoose.model("sports_Membership", membershipSchema);

module.exports = Sports_Membership;

