
function EmitterIo(){
	this.io;
	this.disconnectSockets.bind(this)
	this.connectedSockets={};
	return this.init()
}
EmitterIo.prototype ={
	constructor:EmitterIo,
	setIo:function(ioInput){
		this.io=ioInput
		return this
	},
	getIo:function(){
		return this.io
	},
	addSocket:function(socket){
		this.connectedSockets[socket.id] = socket;
	},
	getSocket:function(id){
		return this.connectedSockets[id]
	},
	removeSocket:function(socketOrId){
		var id = (typeof socketOrId == "string") ? socketOrId : socketOrId.id;
		var temp ={};
		for(var i in this.connectedSockets){
			if(i != id)temp[i] = this.connectedSockets[i];
		}
		this.connectedSockets = temp;
	},
	connectedSockets:function(){
		return this.connectedSockets
	},
	init:function(){
		var list = [];
		for(var s in this.connectedSockets){
			list.push(this.connectedSockets[s])
		}
		this.disconnectSockets(list);
		this.connectedSockets={};
		return this
	},
	connectSocket:function(socket){
	    socket.join("private");
	    this.connectedSockets[socket.id] = socket;  
	},
	disconnectSockets:function(list){
	    list.forEach(function(id){
	        var socket = this.getSocket(id);
	        if(socket){
	            socket.leave("private");
	            socket.disconnect('unauthorized');
	        }
	    }.bind(this));
	}
}
module.exports = new EmitterIo();