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


router.get("/sports/:id/membership", function (req, res) {
    console.log("membership");
    venue.findById(req.params.id, function (err, venue) {
        res.render("venue/membership.ejs", {
            venue: venue
        });

    })
})
router.post("/venue/:id/membership", function (req, res) {
   var name= req.body.name;
   var email= req.body.email;
   var contact= req.body.contact;
     var requirements= req.body.requirements    
    membership.create({
            name: name,
            email: email,
            contact: contact,
            requirements: requirements
        },
        function (err, member) {
            if (err) {
                console.log(err);
            } else {
                console.log(member);
                const data = {
                    from: 'Sports&fitness@gmail.com',
                    to: member.email,
                    subject: 'Booking Done',
                    html: `Hello!!</br> Your membership request for venue  has been successfull submitted.<br> You will get a call from the concerned venue for requirement confirmation<br>.Thank you`
                };
                mg.messages().send(data, function (error, body) {
                    console.log(body);
                });

            }
        }
    )

})
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
                // res.render("venue/sports", {
                //     venue: venue,
                //     pages: pages,
                //     noMatch: noMatch
                // });
                res.json(venue);

            }
        })
    } else {
        venue.find({}, function (err, venue) {
            if (err) {
                console.log(err);
            } else {
                console.log(venue);
                // res.render('venue/sports.ejs', {
                //     venue: venue,
                //     noMatch: noMatch
                // })
                res.json(venue)

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
        var membership_price= req.body.membership_price;
        var type= req.body.type;
        var description= req.body.description;
        const fileType = file.mimetype;
        const validImageTypes = ['image/jpeg','image/jpg','image/png'];
        if (!validImageTypes.includes(fileType)){
            console.log("invalid type of image");
            res.send("Invalid image type please send again");
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
                        fitness.create({name:name,image:result.url,location:location,description:description,membership_price:membership_price,type:type,lat:lat,long:lng},function(err,Venue)
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
        cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'test-dir'
        }, function (error, result) {
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
                    pages: pages
                })

            }

        }
    })

})
router.get("/fitness/:id/membership", function (req, res) {
    fitness.findById(req.params.id, function (err, venue) {
            res.json(venue)

        }

    )
})

router.get("/sports/:id/booking", function (req, res) {
    console.log("haha1");
    if (req.query.date == null) {
        var dateInServer = new Date();
        console.log(dateInServer);
        console.log("1");
        var convert_date = JSON.stringify(dateInServer);
        console.log(convert_date);
        var find_date = moment.utc(convert_date, "YYYY-MM-DD").format('DD-MM-YYYY');
        console.log(find_date);
        var match_date = moment(find_date, "DD-MM-YYYY").format("YYYY/MM/DD");
        console.log(match_date);
    } else {
        dateInServer = new Date(req.query.date);
        console.log(dateInServer);
        convert_date = JSON.stringify(dateInServer);
        console.log(convert_date);
        find_date = moment.utc(convert_date, "YYYY-MM-DD").format('DD-MM-YYYY');
        console.log(find_date);
        var match_date = moment(find_date, "DD-MM-YYYY").format("YYYY/MM/DD");
        console.log(match_date);
    }
    venue.findById(req.params.id, function (err, foundVenue) {
        if (err) {
            console.log(err);
        } else {
            var not_start = new Array();
            console.log(foundVenue);
            booking.findById(foundVenue.booking, function (err, foundBook) {
                console.log(foundBook);
                var start = convert.startSlice(foundBook.start_time, foundBook.start_p);
                var end = convert.endslice(foundBook.end_time, foundBook.end_p);
                console.log(start);
                console.log(end);

                var time_array = convert.calculate_time_slot(parseInt(start), parseInt(end), foundBook.difference);
                console.log(time_array);

                booked.find({
                    VenueId: foundVenue.id,
                    date: match_date
                }, function (err, foundBooked) {
                    console.log(foundBooked);
                    for (var i = 0; i < foundBooked.length; i++) {
                        var start_slot = foundBooked[i].start_time;
                        not_start.push(start_slot);

                    }
                    console.log(not_start);
                    res.render("venue/book.ejs", {
                        time_array: time_array,
                        foundBook: foundBook,
                        foundVenue: foundVenue,
                        length: time_array.length,
                        booked: booked,
                        not_start: not_start,
                        length1: not_start.length,
                        match_date: match_date,
                        pages: pages
                    });
                })
            })
        }
    })


})
router.post('/sports/:id/booked', function (req, res) {
    var data = req.body.booked;
    console.log(req.body);
    console.log(data);
    console.log(data.date);
    var time = data.time;
    console.log(time);
    var time_array = time.split('-');
    var start_time = time_array[0];
    var end_time = time_array[1];
    console.log(start_time);
    console.log(typeof (start_time));

    booked.findOne({
        start_time: start_time,
        end_time: end_time,
        date: data.date,
        VenueId: req.params.id
    }, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            if (found) {
                console.log("this is booked");
                res.send(" already booked");
            } else {
                console.log("done");
                console.log(typeof (data.date));
                console.log(data.date);
                booked.create({
                    name: data.name,
                    email: data.email,
                    contact: data.number,
                    start_time: start_time,
                    end_time: end_time,
                    date: data.date,
                    VenueId: req.params.id
                }, function (err, booked) {
                    if (err) {
                        console.log(err);
                    } else {
                        var date = booked.date;
                        var starting = booked.start_time;
                        var ending = booked.end_time;
                        res.redirect("back");
                        console.log(booked);
                        venue.findById(req.params.id, function (err, venue) {
                            var name = venue.name;
                            const data = {
                                from: 'Sports&fitness@gmail.com',
                                to: booked.email,
                                subject: 'Booking Done',
                                html: `hello!!</br> Your booking for venue: ${name}  has been successfull.<br> date: ${date}<br> from ${starting} to ${ending}</br>`
                            };
                            mg.messages().send(data, function (error, body) {
                                console.log(body);
                            });
                        })


                    }
                })
            }
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router