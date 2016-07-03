var https = require('https');
var http =require('http');
var fs = require('fs');
var express = require('express');
var httpApp = express();
var app = express();

var config = {
	port:3000,
	host:"localhost"
};

app.set('view engine','ejs');
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {     
  res.render('example');
});//end app.get paramas

var myServer = app.listen(
	config.port, 
	function() {
		console.log("Server is now listening on Port :"+config.port); 
	}
);
