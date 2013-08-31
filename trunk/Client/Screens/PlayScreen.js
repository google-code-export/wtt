var PlayScreen = me.ScreenObject.extend(
    {
        onResetEvent: function () {
			var socket = jsApp.getSocket();
            var idVillage = 1; //-->NEED TO SEE THIS BETTER!!
			this.TMXTileMap = "Chunk";
			//Destroying websockets event before create a new one
			jsApp.destroy("onBuildingSelect");
            jsApp.destroy("onListVillageBuildings");
			jsApp.destroy("onRequestUpdate");
			jsApp.destroy("onConstruct");
			jsApp.destroy("onResourcesUpdate");
			
			 //HERE WE SEND THE UPDATE REQUEST
			 socket.on("onRequestUpdate",function(rows, data){
				var infobuild = data;
				console.log("updating building idVillage:"+infobuild.idVillage+" x:"+infobuild.posX+" y:"+infobuild.posY+" idBuilding:"+infobuild.idBuilding);
				if(rows[0][0].Msg == "Done"){
					var time = jsApp.timeToMs(infobuild.buildTimer);
					console.log("ESSE EH O SEU TEMPO:"+time);
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile = 22; // NEED TO SEE THIS BETTER VERY QUICK!
                    var pixelIs = jsApp.getTileForPixels(infobuild.posX,infobuild.posY);
					infobuild.x = infobuild.posX;
					infobuild.y = infobuild.posY;
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
					//updating the resources
					jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
					//
					var progressBar = new jsApp.Timer(time,pixelIs);// creating a new instance of the class Timer
					me.game.add(progressBar,10);// adding this to the screen
                    jsApp.timeScheduler("onUpdateCheck",infobuild);// sending the construction to the scheduler.
					
				}else{
					alert(rows[0][0].Msg);
				}
                 me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                 gameHandler.activeHuds.buildingHUD = undefined;
                 me.game.sort();
			 });
			 
			 //CHECKING IF THE UPDATE ALREADY IS DONE
			 socket.on("onUpdateCheck",function(rows, data){
				var infobuild = data;
				console.log("updating building idVillage:"+infobuild.idVillage+" x:"+infobuild.posX+" y:"+infobuild.posY+" idBuilding:"+infobuild.idBuilding);
				if(rows[0][0].Msg == "Done"){
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile = infobuidl.idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
				}else{
					alert(rows[0][0].Msg);
				}
				
			 });
			 //
			 
			 
             //HERE WE VERIFY IF THE CLICK RESULTS IN A BUILDING AND GET ALL THE DATA TO BUILD THE BUILDING HUD!
			 socket.on('onBuildingSelect', function(data) {
                 $.each(data, function(i, obj) {
                    if(i>0)
                        return false;
                    else{
                        if(gameHandler.activeHuds.buildingHUD==undefined) {
                            //console.log("Basic Description:"+obj[i].basicDescription+" Description:"+obj[i].Description+" idBuilding:"+obj[i].idBuilding+" wood:"+obj[i].wood+" stone:"+obj[i].stone+" iron:"+obj[i].iron+" gold:"+obj[i].gold+" idTile:"+obj[i].idTile);
                            gameHandler.activeHuds.buildingHUD = new jsApp.BuildingHUD(obj[i]);
                            me.game.add(gameHandler.activeHuds.buildingHUD, 1100);
                            me.game.sort();
                        }
                    }
                });
            });
			//

            //HERE WE VERIFY THE BUILDINGS OF THE VILLAGE AND THEIR POSITION
            socket.on("onListVillageBuildings", function(data){
                var buildLayer =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
                for (var i in data[0]){
                    if (i!="remove"){
                        var idTile = data[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
                        var x      = data[0][i].posX;
                        var y      = data[0][i].posY;
						console.log("i:"+i+" x:"+x+" y:"+y+" idtile:"+idTile);
                        buildLayer.setTile(x,y,idTile);//changing the tile
                    }
                }

            });

            socket.emit("onListVillageBuildings", idVillage);
            //
			
			//////////////////////////////////////////
			//Request Construction//
			//
			socket.on("onConstructRequest", function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg != "Done"){
							alert(obj[i].Msg);
						}else{
							console.log("result["+i+"]: "+obj[i].Msg);
							var building = data;
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							var time = jsApp.timeToMs(data.buildTimer);
                            var pixelIs = jsApp.getTileForPixels(building.x,building.y);
							console.log("Changing Tile buildLayer:"+buildLayer+" x:"+building.x+" y:"+building.y+" idTile: 22");
							
							buildLayer.setTile(building.x,building.y,22);//changing the tile for the construction zone
							var progressBar = new jsApp.Timer(time,pixelIs);// creating a new instance of the class Timer
							me.game.add(progressBar,10);// adding this to the screen
							jsApp.timeScheduler("onConstructCheck",building);// sending the construction to the scheduler.

							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData()); //

							me.game.remove(gameHandler.activeHuds.buildingArea,true);// removing the hud layer of the construction
							gameHandler.activeHuds.buildingArea = undefined;
							me.game.sort();
						}
					}

				});
			});
			//////////////////////////////////////////
			
			
			//////////////////////////////////////////
			//constructing and updating resourcesHUD//
			//
			socket.on("onConstructCheck", function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg != "Done"){
							alert(obj[i].Msg);
						}else{
							console.log("result["+i+"]: "+obj[i].Msg);
							var building = data;
							var idTile = building.idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							console.log("Changing Tile buildLayer:"+buildLayer+" x:"+building.x+" y:"+building.y+" idTile:"+idTile);

							buildLayer.setTile(building.x,building.y,idTile);//changing the tile
						}
					}

				});
			});
			////////////////////////////////////
			
			
			///////////////////////////////////////
			//getting the resources by websockets//
			socket.on('onResourcesUpdate', function(data) {
				$.each(data, function(i, obj) {
					if(i>0)
						return false;
					else{
						gameHandler.activeHuds["resourceHud"].WoodValue  = obj[i].wood;
						gameHandler.activeHuds["resourceHud"].StoneValue = obj[i].stone;
						gameHandler.activeHuds["resourceHud"].FoodValue  = obj[i].food;
						gameHandler.activeHuds["resourceHud"].IronValue  = obj[i].iron;
						gameHandler.activeHuds["resourceHud"].GoldValue  = obj[i].gold;
					}
				});

			});
			/////////////////////////////////////////
      
            this.parent();
            /////////////////
            // GAME CAMERA //
            /////////////////
            this.mousedown = false;
            this.mousemoved = false;
            this.mousemove = new me.Vector2d();
            this.mousedelta = new me.Vector2d();

            me.input.registerPointerEvent("mousedown", me.game.viewport, (function (e) {
                this.mousedown = true;
                this.mousemove = new me.Vector2d(~~me.input.changedTouches[0].x,~~me.input.changedTouches[0].y);
				
				

                //IF I HAVE CLIKED IN THE BUILDING HUD,DO NOT REMOVE IT
                if(gameHandler.activeHuds.buildingHUD != undefined){
                    if(gameHandler.activeHuds.buildingHUD.UPRect.containsPointV(me.input.changedTouches[0])){
						var updatebuild = gameHandler.activeHuds.buildingHUD.upInfo;
						console.log(" request update building x:"+updatebuild.posX+" y:"+updatebuild.posY+" idBuilding:"+updatebuild.idBuilding);
						socket.emit("onRequestUpdate",updatebuild);
						if(gameHandler.activeHuds.buildingHUD.buildRect.containsPointV(me.input.changedTouches[0])){
						}
                    }else{
                        //IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
                        me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                        gameHandler.activeHuds.buildingHUD = undefined;
                        me.game.sort();
                        //
                    }
                }else if(gameHandler.activeHuds.actionMenu != undefined && gameHandler.activeHuds.actionMenu.menuRect.containsPointV(me.input.changedTouches[0])) {
                    var menu = gameHandler.activeHuds.actionMenu;
                    // if i clicked the menu
                    if(menu.menuRect != undefined) {
                        if (menu.menuRect.containsPointV(me.input.changedTouches[0])) {
                            // if i clicked the "BUILD" button
                            if(menu.buildRect.containsPointV(me.input.changedTouches[0])) {
                                ///////// PUT THE HUD INTO THE SCREEN
                                // game.add(object, z)
                                if(gameHandler.activeHuds.buildMenu!=undefined)
                                    return;
                                jsApp.send("onListBuilding", jsApp.getUserData());
                            }
                        }
                    }
                }
                //JUST DO IT IF ANY HUD IT'S NOT ON THE SCREEN
				else if((gameHandler.activeHuds.buildMenu == undefined) && (gameHandler.activeHuds.buildingArea == undefined)){

					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs = jsApp.getPixelsForTile(me.input.changedTouches[0].x, me.input.changedTouches[0].y);
					var tileid = buildLayer.getTileId(me.input.changedTouches[0].x+me.game.viewport.pos.x, me.input.changedTouches[0].y+me.game.viewport.pos.y);// getting the current tileid we've clicked on
					if((tileid != null) && (tileid != 22)){ // 22 it's for the construction tile
						var idVillage = 1; // -> NEED TO SEE THIS BETTER!
						socket.emit("onBuildingSelect",{idVillage: idVillage, X: tileIs.x, Y: tileIs.y});
					}
				}
                //
				        
            }).bind(this));

            me.input.registerPointerEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));

            me.input.registerPointerEvent("mousemove", me.game.viewport, (function (e) {
                if (this.mousedown == true) {

                    var pos = new me.Vector2d(
                        ~~me.input.changedTouches[0].x,
                        ~~me.input.changedTouches[0].y
                    );
                    this.mousedelta.copy(pos);
                    this.mousedelta.sub(this.mousemove);

                    this.mousemove.copy(pos);
                    this.mousemoved = true;

                }
            }).bind(this));


            // ADDING THE GAME GUI
            this.hud = new jsApp.ResourcesHUD();
            this.gui = new jsApp.ActionMenu();

            me.game.add(this.hud, 1000);
            me.game.add(this.gui, 1000);

            // LOADS THE MAIN MAP (DEBUG, WILL CHANGE)
            loadMap("Chunk");
            // SORT GRAPHICS RENDERED TO THE SCREEN (SO IT CAN REDRAW IN THE RIGHT ORDER)
            me.game.sort();
        },
		
		onMouseDown: function(){
			
		},
		
        draw: function (context) {
            // Transparent background
            var alpha = context.globalAlpha;
            context.globalAlpha = 0.6;
            context.fillStyle = "#000";
            context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            context.globalAlpha = alpha;
        },

        onUpdateFrame: function () {

            if (this.mousedown) {
                if (this.mousedelta.x || this.mousedelta.y) {
                    // Move viewport
                    me.game.viewport.move(-this.mousedelta.x * 1.2, -this.mousedelta.y * 1.2);
                }

                // Reset mousedelta
                this.mousedelta.setZero();
            }

            // call superclass constructor
            this.parent();
            return true;
        },
        "update": function update() {
            return true;
        },
        onDestroyEvent: function () {
            me.input.releasePointerEvent("mousedown", me.game.viewport);
            me.input.releasePointerEvent("mouseup", me.game.viewport);
            me.input.releasePointerEvent("mousemove", me.game.viewport);
            me.game.disableHUD();
            me.audio.stopTrack();
        }
    });



// called whenever a new map gets loaded by the client
// Parameters
// - String MapName
function loadMap(mapname) {
    //me.state.change(me.state.PLAY);
    me.levelDirector.loadLevel(mapname);
    me.game.sort();
}

function createArrayMap(length) {
    var a = new Array(length || 0);

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < length; i++) {
            a[i] = createArray.apply(this, args);
        }
    }

    return a;
}


