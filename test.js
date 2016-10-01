var redis = require("./redis");

redis.init(function(){
	var client = redis.client();
	client.get("projectIron",function(err,res){
		console.log(res)
	})
})