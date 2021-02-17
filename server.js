const http = require('http');

var server = http.createServer(function (req, res) {
    console.log('Welcome,Client connected to server')
    console.log('req url>>', req.url)
    console.log('req method>>', req.method)

})
server.listen(9090, function (err, done) {
    if (err) {
        console.log('Server listening failed')
    } else {
        console.log('Server listening at port 8080');
    }
})