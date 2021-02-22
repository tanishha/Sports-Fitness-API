const booked = require("../modules/venues/booked.model");
var convert ={}

convert.startSlice=function (start,start_p){
                   
                    var sliced1 = start.split(":");
                    
                    var part2 = parseInt(sliced1[1]);
                if(start_p==="PM")
                {  
                    var part1= parseInt(sliced1[0])+12;
                }
                else
                {
                   var part1 = parseInt(sliced1[0]); 
                }
                var start_t = (part1*60)+part2;   
                return(start_t);               
         }
convert.endslice = function(end,end_p){
       
                var sliced2 = end.split(":");
                var part22= parseInt(sliced2[1]);
                if(end_p==="PM")
                {
                    var part11 = parseInt(sliced2[0])+12;
                }
                else{
                    var part22= parseInt(sliced2[0]);
                }
                var end_t = (part11*60)+part22;
                return(end_t);
 
}
convert.calculate_time_slot=function (start_time, end_time, interval){
    var i, formatted_time;
  var time_slots = new Array();
    for(var i=start_time; i<=end_time; i = i+interval){
    formatted_time = convertHours(i);
    time_slots.push(formatted_time);
  }
  return time_slots;
}
function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
function convertHours(mins)
{
    var hour = Math.floor(mins/60);
      var mins = mins%60;
      var converted = pad(hour, 2)+':'+pad(mins, 2);
      return converted;
}
// convert.sort=function(Array,interval){
//   var booked = new Array();
// for (var i =0;i<Array.length;i++){
//  booked.findOne({start_time:Array[i]},function(err,foundBooked)
//  {
//    if(err){console.log(err);}
//    else
//    {
//      var end_time = foundBooked.end_time;
//      var converted  = end_time.split(":");
//      var part22= parseInt(converted[1]);
//      if(end_p==="PM")
//      {
//          var part11 = parseInt(converted[0])+12;
//      }
//      else{
//          var part22= parseInt(converted[0]);
//      }
//      var end_t = (part11*60)+part22;
//      end_time = end_t-interval;
//      end_time = convertHours(end_time);
//      var start_time = foundBooked.start_time;
//      booked.push(end_time);
//      booked.push(start_time);
//    }
//  }
//  )
// }
// }
module.exports = convert;

