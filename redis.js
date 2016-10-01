var redis = require("redis"),
    client = redis.createClient(
    	10352,
    	"redis-10352.c8.us-east-1-2.ec2.cloud.redislabs.com",
    	{no_ready_check:false}
    );

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});
var data = {
	michael:1,
	time:new Date()
}
function init(cb){
	client.auth('Gonzaga68', function (err) {
    if (err) throw err;
	});
	client.on('connect', function(err) {
	    console.log('Connected to Redis');
	    client.flushdb( function (err, succeeded) {
		    console.log(succeeded); // will be true if successfull
		});
	    cb(err);
	});
}
module.exports = {
	init:init,
	client:function(){
		return client
	},
	clear:function(cb){
		client.flushdb(cb)
	}
}