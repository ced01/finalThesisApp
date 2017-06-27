var express = require('express'),
    app = express(),
    fs = require('fs');

var port = process.env.PORT || 8080;


app.use("/public", express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});