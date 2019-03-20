const express = require('express');
const app = express();

const server = app.listen(3000);
const io = require('socket.io').listen(server);

const boardMaker = require('./helper');

var rooms = [
    { id: 1, name: 'ʀᴏᴏᴍ: 𝕯𝖊𝖘𝖙𝖗𝖚𝖈𝖙𝖎𝖔𝖓', users: [], started: false},
    { id: 2, name: 'ʀᴏᴏᴍ: 𝕻𝖆𝖎𝖓', users: [], started: false},
    { id: 3, name: 'ʀᴏᴏᴍ: 𝕾𝖔𝖗𝖗𝖔𝖜', users: [], started: false},
    { id: 4, name: 'ʀᴏᴏᴍ: 𝕯𝖊𝖛𝖆𝖘𝖙𝖆𝖙𝖎𝖔𝖓', users: [], started: false},
    { id: 5, name: 'ʀᴏᴏᴍ: 𝕯𝖊𝖆𝖙𝖍', users: [], started: false},
    { id: 6, name: 'ʀᴏᴏᴍ: 𝕰𝖓𝖉', users: [], started: false}
  ];

io.sockets.on('connection', (socket)=>{

    socket.on('disconnect', () =>{
        
        let index = rooms.findIndex(room => room.id == socket.room);
        let userIndex = rooms[index].users.findIndex(user => socket.name == user.name);
        rooms[index].users.splice(userIndex, 1);
        
        
        console.log("someone left: ");
        console.log("name:" ,socket.name);
        console.log("Room:" ,socket.room);

        io.sockets.in(socket.room).emit("in-game", {
			name: socket.name,
			event: "left",
			room: socket.room,
			users: rooms[index].users
        });
        
    });


    socket.on("lobby",()=>{   
        io.emit("in-lobby",{rooms: rooms , full: undefined});
    });


    socket.on("click",(coord)=>{
        let currentroom = rooms.find((cr) => cr.id == coord.room);
        let currentuser = currentroom.users.find((cu) => cu = coord.name);

        console.log(currentuser.turn);

        let grant;
        if(currentuser.turn==true){grant = true;currentuser.turn==false;}

        console.log(currentuser.turn);

        io.sockets.in(socket.room).emit("grant", {
            access: grant,
            user: coord.name,
            coor: coord.click,
            users: currentroom.users
        });
    });


    socket.on("ready",(user)=>{        
        let currentroom = rooms.find((cr) => cr.id == user.room);
        let currentuser = currentroom.users.find((cu) => cu = user.name);
        currentuser.ships.push(boardMaker());
        
        let last, lastuser;
        if(currentuser.ships.length == 2){
            last = true;
            lastuser = user.name;
        }
        else{last = false; currentuser.turn=true;}


        io.emit("in-lobby",rooms);
        io.sockets.in(socket.room).emit("ships", {
            event: "ships generated for",
            user: user.name,
            ships: currentuser.ships,
            inv: last,
            pop: lastuser
        });

    });    
            

    socket.on('open-room', (gameinfo) =>{
        console.log("someone joined:");
        console.log("name:" ,gameinfo.name);
        console.log("Room:" ,gameinfo.room);
        socket.name = gameinfo.name;
	    socket.room = gameinfo.room;
        socket.join(gameinfo.room);

        let currentroom = rooms.find((match) => match.id == gameinfo.room );
        currentroom.users.push(gameinfo);
        
        
        if(currentroom.users.length == 2){
        currentroom.started = true;        
        }
        
        io.emit("in-lobby",rooms);

        io.sockets.in(socket.room).emit("in-game", {
            name: gameinfo.name,
            event: "joined",
            room: currentroom
        });
    });
    

    
});