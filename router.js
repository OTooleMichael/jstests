var express = require('express');
var router = express.Router();
var users = require("./users");

////////////////////////////////////////////////

////////        Routing Part 

////////////////////////////////////////////////

//Race Route
router.get('/*', function(req, res) {
	console.log(req.session);
	//var socketUuid = users.addSocket(req.user.id);
  	res.render('example',{uuid:socketUuid,name:req.user.id});       
});//router.get Race Frame



module.exports = router;