
var socketio = require('socket.io');
var io;

var users = require("./users");
var emitter = require("./emitter");
var proxies = require("./proxies");
function init(server) {
    io = socketio(server);
    io.set('authorization', function (handshakeData, accept) {
        var sessionId = cookieParse(handshakeData.headers.cookie).session;
        users.findSessionFromCookie(sessionId,function(err,session){
            if(err) return accept(err,false);
            if( new Date() - new Date(session.timestamp) > 25*60*60*1000) return accept("Cookie no longer valid",false);
            return accept(null,true) 
        });  
    });

    io.on('connection', function (socket) {
        socket.user = users.parseCookie(cookieParse(socket.handshake.headers.cookie).session);
        users.addSockets(socket.user.uuid,socket.id);
        emitter.connectSocket(socket);
    	socket.on("disconnect",function(){
            console.log('user '+socket.id+' Disconnected');
    		socket = emitter.getSocket(socket.id);
            users.removeSocket(socket.user.uuid,socket.id);
            emitter.removeSocket(socket.id)
    	});
        socket.on("proxies",function(proxies){
            proxies.testProxies(proxies,function(err,res){
                socket.emit("proxies",res);
            });
        });
    });
    emitter.setIo(io);
    return io;
}

function cookieParse(cookie){
    var out ={};
    var pairs = cookie.split("; ");
    pairs.forEach(function(p){
        p = p.split("=");
        out[p[0]] = decodeURIComponent(p[1]);
    })
    return out
}

module.exports = {
    init:init,
    io:function(){return io}
};



