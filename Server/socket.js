
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
        connection.query("CALL `makeBuildings`("+data.idVillage+","+data.x+","+data.y+","+data.idBuilding+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				socket.emit("onConstruct", rows);
                /*if(rows[1].Msg == "Done") {
					socket.emit("onConstruct", rows);
                } else {
					socket.emit("message", {msg: rows[1].Msg});
                }*/
            }
        });
    });
					/*while(count--){
					console.log("result["+count+"]: "+fields[count].Msg+" Description:"+fields[count].Description+" idBuilding:"+fields[count].idBuilding+" wood:"+fields[count].wood+" stone:"+fields[count].stone+" iron:"+fields[count].iron+" gold:"+fields[count].gold);
					
				}*/
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
				/*var count = fields.length;
				    for (var i in rows) {
						console.log("results["+i+"]"+rows[i].wood);
					}

				if(rows[1].Msg == undefined) {
					socket.emit("onBuildingSelect", {Description: rows[1].Description, idBuilding: rows[1].idBuilding, wood: rows[1].wood, stone: rows[1].stone, iron: rows[1].iron, gold: rows[1].gold});
                }else {
					socket.emit("message", {msg: rows[1].Msg});
                }*/
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


});


console.log("Way of The Temple SuperDumper Server running beautifully on port 8080");
