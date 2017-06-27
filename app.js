var express = require('express'),
    app = express(),
    fs = require('fs');

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use("/public", express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});