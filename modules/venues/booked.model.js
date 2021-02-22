var mongoose = require("mongoose");
var venue= require("./venue.model");

var bookedSchema = new mongoose.Schema({
    VenueId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Venue"
    },
    name:String,
    email:String,
    contact:Number,
    date:String,
    start_time:String,
    end_time:String,
    price:Number
});
var Booked = mongoose.model("Booked", bookedSchema);

module.exports = Booked;

