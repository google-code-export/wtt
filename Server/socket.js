
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

    ///////////////////
    // Request Chunk //
    ///////////////////
    socket.on('onResourcesUpdate', function(data) {
        //var chunk = data.chunk;
        //console.log("getting chunk data for chunk zone ="+chunk.zoneId+" and chunk XY = "+chunk.x+","+chunk.y);
        //if(false) {
        //
        //}
    });

  //////////////////////////
  // onResourcesUpdate    //
  //////////////////////////
  socket.on('onResourcesUpdate', function(data) {
      console.log("getting resources from idUser ="+data.userId);
      connection.query("CALL `getResources`('"+data.userId+"')",function(err, rows, fields){
          if(rows.length==undefined || rows.length==0)
              socket.emit("message", {msg:"Player not found!"});
          socket.emit("onResourcesUpdate", rows);
     });
  });
  
	///////////////////////////
	// onResourcesCollect    //
	//////////////////////////
	socket.on('onResourcesCollect', function(data) {
		console.log("CALL `TimeCheckResource`("+data.idVillage+","+data.x+","+data.y+")");
		connection.query("CALL `TimeCheckResource`("+data.idVillage+","+data.x+","+data.y+")",function(err, rows, fields){
			//if(rows.length==undefined || rows.length==0)
				//socket.emit("message", {msg:"Error!"});
			socket.emit("onResourcesCollect", rows, data);
		});
	});

    //////////////////////////
    // onListBuilding       //
    //////////////////////////
    socket.on('onListBuilding', function(data) {
        console.log("getting build list for user idVillage ="+data.idVillage);
        connection.query("CALL `possibleBuildings`("+data.idVillage+")",function(err, rows, fields){
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



    ////////////////////
    // onRequestUnit  //
    ////////////////////
    socket.on('onRequestUnit', function(data) {
        console.log("creating unit id "+data.idUnit+" at building id " + data.idBuildingBuilt);
        connection.query("CALL `CreateUnit`("+data.idBuildingBuilt+","+data.idUnit+",'"+randomName()+"')",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onRequestUnit", rows, data);
            }
        });
    });
	
	////////////////////
    // onUnitCheck    //
    ////////////////////
    socket.on('onUnitCheck', function(data) {
        console.log("Verifying unit id "+data.idUnit+" at building id " + data.idBuildingBuilt+",vila"+data.idVillage+",x"+data.buildingX+",y"+data.buildingY);
        connection.query("CALL `TimeCheckUnit`("+data.idVillage+","+data.buildingX+","+data.buildingY+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onUnitCheck", rows, data);
            }
        });
    });
	
	/////////////////////////
    // onOpenCreateSquad  //
    ///////////////////////
    socket.on('onOpenCreateSquad', function(data) {
        console.log("Verifying units in village id "+data);
        connection.query("CALL `ViewToCreateSquad`("+data+")",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onOpenCreateSquad", rows, data);
            }
        });
    });
	
	/////////////////////////
    // onCreateSquad      //
    ///////////////////////
    socket.on('onCreateSquad', function(data) {
        console.log("Creating squad name "+data.squadName);
        connection.query("CALL `newSquad`("+data.idVillage+",'"+data.idUnits+"','"+data.squadName+"')",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onCreateSquad", rows, data);
            }
        });
    });
	
	
	/////////////////////////
    // onViewSquad        //
    ///////////////////////
    socket.on('onViewSquad', function(data) {
        console.log("Viewing squads from idVillage: "+data);
        connection.query("CALL `ViewVillageSquad`("+data+")",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onViewSquad", rows, data);
            }
        });
    });
	
	/////////////////////////
    // onSquadDetail      //
    ///////////////////////
    socket.on('onSquadDetail', function(data) {
        console.log("Viewing units from squads: "+data);
        connection.query("CALL `CountUnitSquad`("+data+")",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onSquadDetail", rows, data);
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
    // onListVillageUnits   //
    //////////////////////////
    socket.on('onListVillageUnits', function(data) {
        console.log(data.idVillage);
        connection.query("CALL `getVillageUnit`("+data.idVillage+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                if(data.openMenu != undefined)
                    rows[2] = "openMenu";
                socket.emit("onListVillageUnits", rows);
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
				if(rows[0][0].idBasicBuild == undefined){
					var idBuilding = rows[0][0].idBuilding;
				}else{
					var idBuilding = rows[0][0].idBasicBuild;
				}
				
				console.log("idBuilding:"+idBuilding);
				console.log(rows[0][0]);
				connection.query("CALL `UnitBuildingCanBuild`('"+idBuilding+"')",function(err2, rows2, fields2){
					if(rows2 == undefined ||rows2.length==undefined || rows2.length==0){
					}else{
						rows[0][0].listUnitsCanMake = rows2[0];

					}
					socket.emit("onBuildingSelect",rows,data);
				});				
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
	
	///////////////////////////
    // onRequestUpdate      //
    /////////////////////////
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
	
	////////////////////////
    // onCheckUpdate     //
    //////////////////////
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
	
	/////////////////////
    // onSellMenu     //
    ///////////////////
	socket.on("onSellMenu", function(){
		connection.query("CALL `ViewSell`()", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onSellMenu",rows);
            }
        });
	});
	/////////////////////////////
	
	/////////////////////
    // onCreateOffer  //
    ///////////////////
	socket.on("onCreateOffer", function(data){
		connection.query("CALL `doOffer`("+data.userId+","+data.idResource+","+data.qtd+","+data.prc+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onCreateOffer",rows,data);
            }
        });
	});
	/////////////////////////////
	
	/////////////////////
    // onBuyMenu      //
    ///////////////////
	socket.on("onBuyMenu", function(data){
		connection.query("CALL `ViewOffer`("+data+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onBuyMenu",rows);
            }
        });
	});
	/////////////////////////////
	
	/////////////////////
    // onBuyOffer  //
    ///////////////////
	socket.on("onBuyOffer", function(data){
		connection.query("CALL `BuyOffer`("+data.userId+","+data.idOffert+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onBuyOffer",rows,data);
            }
        });
	});
	/////////////////////////////
	
	////////////////////////////
    // onListWorldVillage     //
    ///////////////////////////
	socket.on("onListWorldVillage", function(){
		connection.query("CALL `getWorldVillages`(1)", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onListWorldVillage",rows);
            }
        });
	});
	/////////////////////////////
	

	////////////////////////////
    // onVillageSelect        //
    ///////////////////////////
	socket.on("onVillageSelect", function(data){
		connection.query("CALL `ViewVillageOwner`("+data.idUser+","+data.x+","+data.y+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onVillageSelect",rows,data);
            }
        });
	});	
	////////////////////////////
});

// gotta put some more names here or try to use this:
// http://deron.meranda.us/data/census-dist-male-first.txt
var nomes = [
    "Jhony", "Manolo", "Dirceu", "Castro","Tod","Ted","Toky", "Texugo","Minot","Valor","Valdemir","Vlad","Tzao","Forcas","Dorias","Warren", "Leon", "Leonidas","Leonard",
    "Dolgare", "Denim","Cloud","Mario","Bone","Vice","Lans","Gildus","Guido","Mildain","Mondain","Wallace", "William", "Merlin","Sephiroth","Bob","Bilbo", "Bager","Toey"
]

var randomName = function() {
    var random =  Math.floor((Math.random()*nomes.length-1));
    return nomes[random];
}


console.log("Way of The Temple SuperDumper Server running beautifully on port 8080");
