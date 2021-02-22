var mongoose = require("mongoose");
var fitnessSchema = new mongoose.Schema({
  name: String,
  image:String,
  location:String,
  link:String,
  description:String,
  lat:Number,
  long:Number,
  membership_price:Number,
  type:String,
  category:{type:String,default:'fitness'}
});
var Fitness = mongoose.model("Fitness", fitnessSchema);

module.exports = Fitness;
