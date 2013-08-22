
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
      console.log("getting resources from idUser ="+data.userId);
      connection.query("CALL `getResources`('"+data.userId+"')",function(err, rows, fields){
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
    // onConstructRequest   //
    //////////////////////////
   socket.on('onConstructRequest', function(data) {
        console.log("verifying and building idBuilding="+ data.idBuilding +" idVillage=" + data.idVillage + " posx =" + data.x + " posy ="+ data.y);
        connection.query("CALL `makeBuildings`("+data.idVillage+","+data.x+","+data.y+","+data.idBuilding+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				socket.emit("onConstructRequest", rows, data);
            }
        });
    });
	
    //////////////////////////
    // onConstructCheck     //
    //////////////////////////
   socket.on('onConstructCheck', function(data) {
        console.log("verifying if building its finished idBuilding="+ data.idBuilding +" idVillage=" + data.idVillage + " posx =" + data.x + " posy ="+ data.y);
        connection.query("CALL `TimeCheck`("+data.idVillage+","+data.x+","+data.y+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				socket.emit("onConstructCheck", rows, data);
            }
        });
    });


	//////////////////////////
    // onBuildingSelect     //
    //////////////////////////
	socket.on('onBuildingSelect', function(data) {
		console.log("Verifying if the building exist on : idVillage->"+data.idVillage+" X->"+data.X+" Y->"+data.Y);
		connection.query("CALL `upgradeBuildView`("+data.idVillage+","+data.X+","+data.Y+")",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onBuildingSelect",rows);
			}
		});
	});
	////////////

    ////////////////////////////
    // onListVillageBuildings //
    ////////////////////////////
    socket.on('onListVillageBuildings', function(data){
        console.log("Listing Buildings from idVillage:"+data);
        connection.query("CALL `getVillageBuilding`("+data+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onListVillageBuildings",rows);
            }
        });
    });
    /////////////////////////

    ////////////////////////////
    // onListVillages //////////
    ////////////////////////////
    socket.on('onListVillages', function(data){
        console.log("Listing Villages from userId:"+data.userId);
        connection.query("CALL `getUserVillages`("+data.userId+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onListVillages",rows);
            }
        });
    });
    /////////////////////////
	
	////////////////////////////
    // onRequestUpdate //////////
    ////////////////////////////
    socket.on('onRequestUpdate', function(data){
        console.log("Updating idbuilding:"+data.idBuilding+" x:"+data.posX+" y:"+data.posY);
        connection.query("CALL `updateBuildings`("+data.idVillage+","+data.idBuilding+","+data.posX+","+data.posY+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onRequestUpdate",rows, data);
            }
        });
    });
    /////////////////////////
	
	////////////////////////////
    // onCheckUpdate //////////
    ////////////////////////////
    socket.on('onCheckUpdate', function(data){
        console.log("Updating idbuilding:"+data.idBuilding+" x:"+data.posX+" y:"+data.posY);
        connection.query("CALL `TimeCheck`("+data.idVillage+","+data.posX+","+data.posY+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onCheckUpdate",rows, data);
            }
        });
    });
    /////////////////////////
	
});


console.log("Way of The Temple SuperDumper Server running beautifully on port 8080");
