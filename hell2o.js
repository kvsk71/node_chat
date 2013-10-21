//var app = require('express').createServer();
var express = require('express');
     app=express();  

 var http = require('http');
 var server = http.createServer(app)
var io = require('socket.io').listen(server);
server.listen(8000);
 
app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});
 
var activeClients = 0;

var clients_name = [];
 
io.sockets.on('connection', function(socket){clientConnect(socket);
	
	  var sid=socket.id;
	 
	  io.sockets.sockets[sid].emit('mysid',sid);
     
      socket.on('chatm',function (data) {sermsg(data,socket);});
      
	  socket.on('disconnect', function(){clientDisconnect()});
	  
	  socket.on('adduser',function (data) { manageusers(data,sid);});
	  
	  socket.on('rmuser',function (data) {remusers(data);});
	});

function sermsg(data,socket){ 
	 var sid=data.seid;
	io.sockets.sockets[sid].emit('chatm', {name:data.cp_name,msgb:data.cp_msg});
  //socket.broadcast.emit('chatm',{name:data.cp_name,msgb:data.cp_msg});
	
}

function manageusers(data,socketid){

	clients_name.push(data.adu+':'+socketid);
	io.sockets.emit('adduser', {name_list:clients_name});
 }
 function remusers(data){
	 
	clients_name.splice(clients_name.indexOf(data.adu),1);
	io.sockets.emit('adduser', {name_list:clients_name});
	 }
 
function clientConnect(socket){
  activeClients +=1;
  
  io.sockets.emit('message', {clients:activeClients});
 
}
 
function clientDisconnect(){
  activeClients -=1;
  io.sockets.emit('message', {clients:activeClients});
}
