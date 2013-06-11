
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'dqm50vnc',
  database : 'Jogo'
});

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  /////////////
  // onLogin //
  /////////////
  socket.on('login', function (data) {
		console.log("logging user "+data.p1+" with passw "+data.p2);
		connection.query("call Auth('"+data.p1+"','"+data.p2+"');", function(err, rows, fields) {
            console.log(err);
            if(err) throw err;
			if(rows==undefined || rows.length==undefined || rows.length==0)
				socket.emit("message", {msg:"Wrong username and/or Passworde!"});
			else
                if(rows[0].msg != undefined) {
                    socket.emit("message", {msg:rows[0].msg});
                } else {

				    socket.emit("loginok", rows);
                    console.log("Loggin "+rows[1].userId+" with sid "+rows[1].sessionId);
                }
		});
  });


  //////////////////////////
  // onResourcesUpdate       //
  //////////////////////////
  socket.on('onResourcesUpdate', function(data) {
      console.log("getting resources from idUser ="+data.idUser);
      connection.query("CALL `getResources`('"+data.idUser+"')",function(err, rows, fields){
          if(rows.length==undefined || rows.length==0)
              socket.emit("message", {msg:"Player not found!"});
          socket.emit("onResourcesUpdate", rows);
     });
  });

    //////////////////////////
    // onListBuilding       //
    //////////////////////////
    socket.on('onListBuilding', function(data) {
        console.log("getting build list for user idUser ="+data.userId);
        connection.query("CALL `possibleBuildings`("+data.userId+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0)
                socket.emit("message", {msg:"Player not found!"});
            socket.emit("onListBuilding", rows);
        });
    });

    //////////////////////////
    // onConstruct          //
    //////////////////////////
   socket.on('onConstruct', function(data) {
        console.log("verifying and building idBuilding="+ data.idBuilding +" idVillage=" + data.idVillage + " posx =" + data.x + " posy ="+ data.y);
        connection.query("CALL `moneytoBuildings`("+data.idVillage+","+data.idBuilding+","+data.x+","+data.y+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				var count = rows.length;
				while(count--){
					console.log("result["+count+"]: "+rows[count].Msg+" vila:"+rows[count].Vila+" X:"+rows[count].X+" Y:"+rows[count].Y);
				}
				socket.emit("onConstruct", rows);
                /*if(rows[1].Msg == "Done") {
					socket.emit("onConstruct", rows);
                } else {
					socket.emit("message", {msg: rows[1].Msg});
                }*/
            }
        });
    });
});


console.log("Way of The Temple SuperDumper Server running beautifully on port 8080");
