const express = require('express')
const app = express();
const morgan = require('morgan')
const path = require('path')
const cors = require ('cors')
const fileupload = require('express-fileupload');
const ejs = require('ejs');

//view engine setup
app.locals.moment = require('moment');
app.set('view engine',"ejs");
app.set('views', path.join(__dirname, 'views'))

//files setup
app.use("/images",express.static(path.join(__dirname,"images")));
app.use("/api/images",express.static(path.join(__dirname,"images")));
var images = path.join(__dirname+'/images');
console.log(images);
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: images
}));
app.use("/css",express.static(__dirname+"/css"));
app.use("/api/css",express.static(__dirname+"/css"));
app.use("/api/pages/css",express.static(__dirname+"/css"));
//db
require('./db')

//call routing level middleware
const apiRoute=require('./routes/api.routes')

//load third-party middleware
app.use(morgan('dev'))

//cors
app.use(cors()) //to accept every incoming request

//inbuilt middleware for parsing incoming data
app.use(express.urlencoded({ 
    extended: true
}))
app.use(express.json()) //(for json)

//load routing level middleware(mount)
app.use('/api',apiRoute)
app.use(function (req, res, next) { //for undefined request
    next({
        msg: 'NOT FOUND 404',
        status: 404
    })
})

//error handling middleware
app.use(function (err, req, res, next) {
    console.log('Error is >>', err)
    res.status(err.status||400)
    .json({
        msg: err.msg || err,
        status: err.status||400
    })
})

app.listen(9090, function (err, done) {
    if (err) {
        console.log('Server listening failed')
    } else {
        console.log('Server listening at port 9090');
    }
})