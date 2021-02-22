require('dotenv').config();

const router = require('express').Router();
const fitness = require("./fitness.model");
const booking = require("./booking.model");
const moment = require('moment');
const url = require('url');
const venue = require("./venue.model");
var ts = require("time-slots-generator");
const convert = require("../../helpers/bookingDetails");
const booked = require("./booked.model");

const {
    compile
} = require('morgan');
const mailgun = require("mailgun-js");
const membership = require("./sportsMembership.model");
const NodegeoCoder = require("node-geocoder");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRETE
})

const DOMAIN = process.env.DOMAIN;
const mg = mailgun({
    apiKey: process.env.MAILGUN_API,
    domain: DOMAIN
});
// router.route('/')
//     .get(PageCtrl.get)
var options = {
    provider: 'opencage',

    // Optional depending on the providers
    httpAdapter: 'https',
    apiKey: process.env.OCD_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null
};
var geocoder = NodegeoCoder(options);




// router.get('/home', function (req, res) {
//     PageModel.find(function (err, pages) {
//         if (err) {
//             console.log(err)
//         }
//         console.log(pages);
//         res.render('home.ejs',{
//             pages: pages

//         })
//     })

// })

router.get('/sports', function (req, res) {

    if (req.query.search) {
        var noMatch;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        venue.find({
            "name": regex
        }, function (err, venue) {
            if (err) {
                console.log(err);
            } else {

                if (venue.length < 1) {
                    noMatch = "doesnot match";
                }
                res.render("venue/sports.ejs", {
                    venue: venue,
                   
                    noMatch: noMatch
                });

            }
        })
    } else {
        venue.find({}, function (err, venue) {
            if (err) {
                console.log(err);
            } else {
                console.log(venue);
                res.render('venue/sports.ejs', {
                    venue: venue,
                    noMatch: noMatch
                })

            }
        })

    }

})
router.get('/fitness', function (req, res) {

    fitness.find({}, function (err, venue) {
        if (err) {
            console.log(err);
        } else {
            console.log(venue);
            // res.render('venue/fitness.ejs', {
            //     venue: venue,
            // })
            res.json(venue)

        }
    })

})
router.post("/fitness/add",function(req,res)
{
    var name = req.body.Name;
        var file = req.files.photo;
        var location= req.body.location;
        var link=req.body.link;
        var membership_price= req.body.membership_price;
        var type= req.body.type;
        var description= req.body.description;
        const fileType = file.mimetype;
        const validImageTypes = ['image/jpeg','image/jpg','image/png'];
        if (!validImageTypes.includes(fileType)){
            console.log("invalid type of image");
            res.send("Invlalid image type please send agian");
        } else {
            console.log(file);
            console.log("\n \nBody values below:");
            console.log(req.body);
            cloudinary.uploader.upload(file.tempFilePath,{folder:'test-dir'},function(error,result){
                if (error)
                    throw error;
                console.log(" temp File is :"+file.tempFilePath);
                fs.unlink(file.tempFilePath,function(err){
                    if (err){
                        console.log("error removing file. Please remove it : "+err)
                    }
                    // perform db operations and send the data to client
                    geocoder.geocode(location, function(err, data){
                        console.log("reached");
                      if(err || !data.length){
                          return res.redirect('back');
                      }
                     
                       var lat = data[0].latitude;
                        var lng  =  data[0].longitude;
                        fitness.create({name:name,image:result.url,location:location,link:link,description:description,membership_price:membership_price,type:type,lat:lat,long:lng},function(err,Venue)
                        {
                            if(err){console.log(err);}
                            else
                            {
                                console.log(Venue);
                                //===after successfully aading go to home page ===//
                                res.send("added");
                            }
                        }
                        )
                        })});
            });}
});

router.post("/sports/add", function (req, res) {
    var name = req.body.Name;
    var location = req.body.location;
    var link=req.body.link;
    var start = req.body.start;
    var end = req.body.end;
    var diff = req.body.difference;
    var start_p = req.body.start_p;
    var end_p = req.body.end_p;
    var type = req.body.sports_type;
    var file = req.files.photo;
    console.log(file);
    const fileType = file.mimetype;
    console.log(fileType);
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validImageTypes.includes(fileType)) {
        console.log("invalid type of image");
        res.send("Invlalid image type please send agian");
    } else {
        console.log(file);
        console.log("\n \nBody values below:");
        console.log(req.body);
        cloudinary.uploader.upload(file.tempFilePath, {folder: 'test-dir'}, function (error, result) {
            if (error)
                throw error;
            console.log(" temp File is :" + file.tempFilePath);
            fs.unlink(file.tempFilePath, function (err) {
                if (err) {
                    console.log("error removing file. Please remove it : " + err)
                }
                // perform db operations and send the data to client
                // res.send({sucess: true,message: result.url});
                console.log(result.url);
                booking.create({
                    start_time: start,
                    end_time: end,
                    difference: diff,
                    start_p: start_p,
                    end_p: end_p
                }, function (err, book) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(book);
                        geocoder.geocode(req.body.location, function (err, data) {
                            if (err || !data.length) {
                                return res.redirect('back');
                            }
                            console.log(data);
                            var lat = data[0].latitude;
                            var lng = data[0].longitude;

                            console.log(location);
                            console.log(lat);
                            console.log(lng);
                            venue.create({
                                name: name,
                                image: result.url,
                                location: location,
                                booking: book,
                                lat: lat,
                                long: lng,
                                link:link,
                                type: type
                            }, function (err, venue) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(venue);
                                    res.send("added");
                                }
                            })
                        })
                    }
                });


            });
        });
    }





})
router.get('/sports/add', function (req, res) {

    res.render('venue/sports_add.ejs', {
        // pages: pages
    });


})


router.get("/sports/:id", function (req, res) {

    venue.findById(req.params.id, function (err, venue) {
        if (err) {
            console.log(err);
        } else {
            if (venue) {
                res.render("venue/sports_info.ejs", {
                    venue: venue,
                    pages: pages
                })

            }

        }

    })

})
router.get('/fitness/add', function (req, res) {

    res.render('venue/fitness_add.ejs', {
        // pages: pages
    });


})
router.get("/fitness/:id", function (req, res) {

    fitness.findById(req.params.id, function (err, venue) {
        if (err) {
            console.log(err);
        } else {
            if (venue) {
                res.render("venue/fitness_info.ejs", {
                    venue: venue,
                })

            }

        }
    })

})




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router