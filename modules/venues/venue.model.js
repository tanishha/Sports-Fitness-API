var mongoose = require("mongoose");
var Booking = require("./booking.model");

var venueSchema = new mongoose.Schema({
  name: String,
  image:String,
  location:String,
  link:String,
  lat:Number,
  long:Number,
  booking_price:Number,
  membership_price:Number,
  type:String,
  category:{type:String, default:'sports'},
booking:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Booking"
  
}

});
var Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
