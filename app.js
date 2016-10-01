/////////////////////////
//  required modules and scripts
/////////////////
var http =require('http');
var app = require("./express");
var db = require("./redis");
var sockets = require("./sockets");
var hosts = {
    port:3000,
    host:"localhost"
}

/////////////////////////
//  Middle Ware Routing
/////////////////



start()
function start(){
    db.init(function(err){
        if(err){
            throw err
        }
        var server = http.createServer(app);
        var io = sockets.init(server);
        server.listen(hosts.port,hosts.host, function(){
            console.log("Server is now listening on Port "+hosts.host+":"+hosts.port); 
        });
   });
}