var users;
var redis = require("./redis").client();
var cry = require("./crypt"),
    encrypt = cry.encrypt,
    decrypt = cry.decrypt;
var emitter =require("./emitter");
function init(){
	users = {
	    brendanCuffe:{
	    	pass:"5tgB3edC",
	    	permission:"admin"
	    },
	    projectIron:{
	    	pass:"whiteOak",
	    	permission:"basic"
	    },
	    steve:{
	    	pass:"thisPass321",
	    	permission:"basic"
	    }
	};
}
init();

function findUser(id,cb){
	cb(null,users[id])
}

function deleteKey(key){
	redis.del(key);
}

function getSockets(uuid,cb){
	redis.get(uuid,function(err,res){
		if(err)return cb(err);
		if(!res)return cb(null,[]);
		var list = JSON.parse(res);
		return cb(null,list)
	});
};

function addSockets(uuid,sockets,cb){
	if(typeof sockets == "string") sockets = [sockets];
	getSockets(uuid,function(err,list){
		list = list.concat(sockets);
		saveSockets(uuid,list,cb)
	});
}

function saveSockets(uuid,sockets,cb){
	cb=cb || function(){};
	redis.set(uuid,JSON.stringify(sockets),cb)
};

function removeSocket(uuid,socket,cb){
	getSockets(uuid,function(err,list){
		list = list.filter(function(el){
			return el !=socket
		});
		saveSockets(uuid,list,cb)
	});
}

function loginUser(user,cb){
	findUser(user.id,function(err,res){
		if(err || res == null) return cb("User Could Not Be Found");
		if(res.pass !== user.pass) return cb("Password Incorrect");
		user.permission = res.permission;
		findUserSession(user.id,function(err,res){
			if(res && res.permission!="admin"){
				var uuid = res.activeSession;
				removeSession(uuid,function(){
					redis.hdel(user.id,uuid);
					makeSession(user,cb)
				});
			}else{
				makeSession(user,cb);
			}
		});
	});
};

function removeSession(sessionId,cb){
	getSockets(sessionId,function(err,list){
		emitter.disconnectSockets(list);
		list.forEach(function(sock){
			emitter.removeSocket(list);
		});
		deleteKey(sessionId);
		cb(null,true);
	});
}

function makeSession(user,cb){
	var uuid = makeid();
	user.uuid = uuid;
	var session = {
		timestamp:new Date(),
		ip:user.ip,
		agent:user.agent
	};
	user.session = session;
	redis.hmset(user.id,
		[
			"user",JSON.stringify(user),
			"permission",user.permission,
			"activeSession" , uuid,
			uuid, JSON.stringify(session)
		],function(err,res){
			if(err)console.log(err);
			if(err)cb("Couldnt Create User Session");
		cb(null,user)
	});
}

function findUserSession(userId,cb){
	console.log(userId);
	redis.hgetall(userId,function(err,res){
    	if(err) return cb(err);
    	if(!res) return cb("No session Found");
    	console.log(res);
    	return cb(null,res);
    });
}

function findSession(userId,sessionId,cb){
	redis.hmget(userId,sessionId,function(err,res){
		if(err) return cb(err);
    	if(!res) return cb("No session Found");
    	return cb(null,JSON.parse(res));
	})
}

function findSessionFromCookie(cookie,cb){
	if(!cookie) return cb("No Cookie found");
	var cookie = parseCookie(cookie)
    var user = cookie.user;
    var uuid = cookie.uuid;
    findUserSession(user,function(err,session){
    	if(err) return cb(err);
    	if(uuid !== session.activeSession) return cb("Duplicate Login",uuid);
    	var output = JSON.parse(session[session.activeSession]);
    	output.permission = session.permission;
    	console.log(output)
    	return cb(null,output)
    });
}

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function parseCookie(sessionCookie){
	var cookie = sessionCookie.split("&");
    var user = decrypt(cookie[0]);
    var uuid = decrypt(cookie[1]);
    return {
    	user:user,
    	uuid:uuid
    }
}

module.exports = {
	parseCookie:parseCookie,
	loginUser:loginUser,
	findUserSession:findUserSession,
	findSessionFromCookie:findSessionFromCookie,
	deleteKey:deleteKey,
	addSockets:addSockets,
	removeSocket:removeSocket,
	getSockets:getSockets
}



