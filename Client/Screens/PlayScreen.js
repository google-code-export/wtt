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
			
            //HERE WE VERIFY THE BUILDINGS OF THE VILLAGE AND THEIR POSITION
            socket.on("onListVillageBuildings", function(data){
                var buildLayer =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
                for (var i in data[0]){
                    if (i!="remove"){
                        var idTile  = data[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
                        var x       = data[0][i].posX;
                        var y       = data[0][i].posY;
                        var pending = data[0][i].pending;
						var timer   = data[0][i].Timer;
						var type    = data[0][i].Type;
						//if the construction still pending, add a new progress bar and a timeScheduler event//
                        if(pending == "Y"){
                            idTile   	   = 5;
							changeTile     = data[0][i].idTile + 1;
							time    	   = jsApp.timeToMs(timer);
							pixelIs 	   = jsApp.getTileForPixels(x,y);
							socket.emit("onConstructCheck",{"x" : x, "y" : y, "idVillage" : idVillage, "idTile" : changeTile});
                        }
						//IF IT'S A COLLECTOR --> NEED TO SEE THIS BETTER TOO.
						if(type == "R"){
							console.log(data[0][i]);
							//var gatherTime = jsApp.timeToMs(data[0][i].gatherTime);
							pixelIs 	   = jsApp.getTileForPixels(x,y);
							var gatherTime = 30000;
							socket.emit("onResourcesCollect",{"idVillage": idVillage, "x" : x, "y" : y, "gatherTime" : gatherTime, "type" : idTile}) // --> Need to start the resource collect engine
						}
                        buildLayer.setTile(x,y,idTile);//changing the tile
                    }
                }
            });

            socket.emit("onListVillageBuildings", idVillage);

            //PLACING UNITS THE PLAYER HAS ON THE MAP
            socket.on("onListVillageUnits", function(data){
                var unitList = data[0];
                var classList = data[1];
                if(data[2]=="openMenu") {
                    gameHandler.activeHuds.villageUnitsGeneral = new jsApp.VillageUnitsGeneral(unitList, classList);
                    gameHandler.activeHuds.villageUnitsGeneral.listUnits = unitList;
                    gameHandler.activeHuds.villageUnitsGeneral.listClasses = classList;
                    me.game.add(gameHandler.activeHuds.villageUnitsGeneral, 1100);
                    me.game.sort();
                }else{
                    var unit = unitList.length;
                    while(unit--) {
                        var thisUnit = unitList[unit];
                        var pos = jsApp.getRandomPointInScreen();
                        var piece = new Unit(pos.x , pos.y , me.ObjectSettings , thisUnit.image);
                        me.game.add(piece, 1000);
                    }
                }
            });
			
			//console.log("village id!!!:"+idVillage);
            socket.emit("onListVillageUnits", {"idVillage" : 1});
			//alert("enviei o "+idVillage+"!!");
            //			
			 //HERE WE SEND THE UPDATE REQUEST
			 socket.on("onRequestUpdate",function(rows, data){
				var infobuild = data;
				console.log("updating building idVillage:"+infobuild.idVillage+" x:"+infobuild.posX+" y:"+infobuild.posY+" idBuilding:"+infobuild.idBuilding);
				if(rows[0][0].Msg == "Done"){
					var time 	   = jsApp.timeToMs(infobuild.buildTimer);
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile 	   = 5; // NEED TO SEE THIS BETTER VERY QUICK!
                    var pixelIs    = jsApp.getTileForPixels(infobuild.posX,infobuild.posY);
					infobuild.x    = infobuild.posX;
					infobuild.y    = infobuild.posY;
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
					//updating the resources
					jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
					//
					var progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class Timer
					var checkUpdate = function(){ socket.emit("onCheckUpdate",infobuild);};
					me.game.add(progressBar,10);// adding this to the screen
                    jsApp.timeScheduler(checkUpdate,time);// sending the construction to the scheduler.
				}else{
					alert(rows[0][0].Msg);
				}
                me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                gameHandler.activeHuds.buildingHUD = undefined;
                me.game.sort();
			 });
			 
			 //CHECKING IF THE UPDATE ALREADY IS DONE
			 socket.on("onCheckUpdate",function(rows, data){
				var infobuild = data;
				console.log("updating building idVillage:"+infobuild.idVillage+" x:"+infobuild.posX+" y:"+infobuild.posY+" idBuilding:"+infobuild.idBuilding);
				if(rows[0][0].Msg == "Done"){
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile 	   = infobuild.idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
				}else{
					alert(rows[0][0].Msg);
				}
			 });
			 //
			 
			 
             //HERE WE VERIFY IF THE CLICK RESULTS IN A BUILDING AND GET ALL THE DATA TO BUILD THE BUILDING HUD!
			 socket.on('onBuildingSelect', function(rows,data) {
                 $.each(rows, function(i, obj) {
                    if(i>0)
                        return false;
                    else{
                        if(gameHandler.activeHuds.buildingHUD==undefined) {
							console.log(obj[i]);
							//THIS WILL DO UNTIL WE FIX IT RIGHT
							if(obj[i].posX == undefined){obj[i].posX = data.X}
							if(obj[i].posY == undefined){obj[i].posY = data.Y}
							//
                            gameHandler.activeHuds.buildingHUD = new jsApp.BuildingHUD(obj[i]);

                            me.game.add(gameHandler.activeHuds.buildingHUD, 1100);
                            me.game.sort();
                        }
                    }
                });
            });
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
							var building = data;
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							var time = jsApp.timeToMs(data.buildTimer);
                            var pixelIs = jsApp.getTileForPixels(building.x,building.y);
							console.log("Changing Tile buildLayer:"+buildLayer+" x:"+building.x+" y:"+building.y+" idTile: 5");
							
							buildLayer.setTile(building.x,building.y,5);//changing the tile for the construction zone
							var progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							me.game.add(progressBar,10);// adding this to the screen
							var vconstructCheck = function(){socket.emit("onConstructCheck",data);};
							jsApp.timeScheduler(vconstructCheck,time);// sending the construction to the scheduler.

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
						if(obj[i].Msg == "Done"){
							var building = data;
							var idTile = building.idTile; // NEED TO SEE THIS BETTER VERY QUICK!
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							console.log("Changing Tile buildLayer:"+buildLayer+" x:"+building.x+" y:"+building.y+" idTile:"+idTile);
							buildLayer.setTile(building.x,building.y,idTile);//changing the tile
							//IF IT'S A COLLECTOR --> NEED TO SEE THIS BETTER
							if(building.Type == "R"){
								var gatherTime     = jsApp.timeToMs(building.TimerColection);
								var pixelIs 	   = jsApp.getTileForPixels(building.x,building.y);
								var resourceColect = function(){socket.emit("onResourcesCollect",{"villageId": idVillage, "x" : building.x, "y" : building.y, "gatherTime" : TimerColection, "type" : idTile})};
								jsApp.timeScheduler(resourceColect,gatherTime);
							}
							
						}else{
							var building 	   = data;
							var time    	   = jsApp.timeToMs(obj[i].Msg);
							var idTile 		   = building.idTile;
							var pixelIs 	   = jsApp.getTileForPixels(building.x,building.y);
							var progressBar    = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							var constructCheck = function(){socket.emit("onConstructCheck",{"x" : building.x, "y" : building.y, "idVillage" : building.idVillage, "idTile" : idTile});};
							me.game.add(progressBar,10);// adding this to the screen
							jsApp.timeScheduler(constructCheck,time);// sending the construction to the scheduler.
							me.game.sort();
						}
					}

				});
			});
			////////////////////////////////////
			
			////////////////////////////////////////////////////////////////
			//Creating Units
			//
			socket.on("onRequestUnit", function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg != "Done"){
						alert(obj[i].Msg);
						}else{
							var unitInfo = data;
							console.log(unitInfo);
							var time = jsApp.timeToMs(obj[i].Timer);
							var pixelIs = jsApp.getTileForPixels(unitInfo.buildingX,unitInfo.buildingY);
							var progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							me.game.add(progressBar,10);// adding this to the screen
							var unitCheck = function(){socket.emit("onUnitCheck",data);};
							jsApp.timeScheduler(unitCheck,time);// sending the construction to the scheduler.

							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
							
							me.game.remove(gameHandler.activeHuds.unitMenu);
							me.game.sort();
						}
					}
				});
			});
			
			socket.on("onUnitCheck", function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg == "Done"){
							// Aqui pra criar o carinha , onde tiver a casa que criou
							// a casa que criou ta no this.building
							var pixelIs = jsApp.getTileForPixels(data.buildingX, data.buildingY);
							var piece   = new Unit(pixelIs.x,pixelIs.y, me.ObjectSettings, data.unitImg);
							me.game.add(piece, 1000);
							me.game.sort();
						}else{
							var unit 	       = data;
							var time    	   = jsApp.timeToMs(obj[i].Msg);
							var pixelIs 	   = jsApp.getTileForPixels(unit.buildingX, unit.buildingY);
							var progressBar    = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							var unitCheck = function(){socket.emit("onUnitCheck",unit);};
							me.game.add(progressBar,10);// adding this to the screen
							jsApp.timeScheduler(unitCheck,time);// sending the construction to the scheduler.
							me.game.sort();
						}
					
					}
				});
			});
			
			//////////////////////////////////////////////////////////////
			
			
			
            ///////////////////////
            // LISTING BUILDINGS //
            ///////////////////////
            jsApp.getSocket().on("onListBuilding", function(data) {
                this.buildMenu = new jsApp.BuildMenu(data[0]);
                gameHandler.activeHuds.buildMenu = this;
                me.game.add(this.buildMenu,1000);
                me.game.sort();
            });			
			
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
			
			///////////////////////////////////////
			//collecting the resources			//
			socket.on('onResourcesCollect', function(rows, data) {
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg == "Done"){
							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData());
							//
							var pixelIs 	   = jsApp.getTileForPixels(data.x,data.y);
							var ColectAlert    = new jsApp.ColectAlert(pixelIs, data.type);
							var resourceColect = function(){socket.emit("onResourcesCollect",{"idVillage": idVillage, "x" : data.x, "y" : data.y, "gatherTime" : data.gatherTime, "type" : data.type})};
							me.game.add(ColectAlert,10); 
							jsApp.timeScheduler(resourceColect,data.gatherTime);	
							me.game.sort();							
						}else{
							// if anyone try to hack, this will add a new time until the update it's done.
							var remainingTime  = jsApp.timeToMs(obj[i].Msg);
							var pixelIs 	   = jsApp.getTileForPixels(data.x,data.y);
							var resourceColect = function(){socket.emit("onResourcesCollect",{"idVillage": idVillage, "x" : data.x, "y" : data.y, "gatherTime" : data.gatherTime, "type" : data.type})};
							jsApp.timeScheduler(resourceColect,remainingTime);
						}
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
					//IF I CLICKED IN THE UPDATE BUTTON
                    if(gameHandler.activeHuds.buildingHUD.UPRect.containsPointV(me.input.changedTouches[0])){
						var updatebuild = gameHandler.activeHuds.buildingHUD.upInfo;
						console.log(" request update building x:"+updatebuild.posX+" y:"+updatebuild.posY+" idBuilding:"+updatebuild.idBuilding);
						socket.emit("onRequestUpdate",updatebuild);
						if(gameHandler.activeHuds.buildingHUD.buildRect.containsPointV(me.input.changedTouches[0])){
						}


                    }else{
						//IF I CLICKED IN THE TRAIN UNIT BUTTON
                        if(gameHandler.activeHuds.buildingHUD.createUnitButton != undefined) {
                            if(gameHandler.activeHuds.buildingHUD.createUnitButton.containsPointV(me.input.changedTouches[0])) {
                                var unitsICanMake = gameHandler.activeHuds.buildingHUD.upInfo.listUnitsCanMake;
                                if(gameHandler.activeHuds.unitMenu==undefined) {
                                    gameHandler.activeHuds.unitMenu = new jsApp.BuildUnitMenu(unitsICanMake, gameHandler.activeHuds.buildingHUD.upInfo);
                                    me.game.add(gameHandler.activeHuds.unitMenu, 1100);
                                    me.game.sort();
                                }
                            }
                        }
                        //IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
                        me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                        gameHandler.activeHuds.buildingHUD = undefined;
                        me.game.sort();
                        //
                    }
                }
                else if(gameHandler.activeHuds.unitMenu!=undefined) {
                    // do nothing but we need this here
                }
                else if(gameHandler.activeHuds.actionMenu != undefined && gameHandler.activeHuds.actionMenu.menuRect.containsPointV(me.input.changedTouches[0])) {
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
                            } else if(menu.unitsRect.containsPointV(me.input.changedTouches[0])) {
                                // AKI
                                socket.emit("onListVillageUnits", {"idVillage" : 1, "openMenu" : "true"});
                            }
                        }
                    }
                }
                //JUST DO IT IF ANY HUD IT'S NOT ON THE SCREEN
				else if((gameHandler.activeHuds.buildMenu == undefined) && (gameHandler.activeHuds.buildingArea == undefined)){

					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs = jsApp.getPixelsForTile(me.input.changedTouches[0].x, me.input.changedTouches[0].y);
					var tileid = buildLayer.getTileId(me.input.changedTouches[0].x+me.game.viewport.pos.x, me.input.changedTouches[0].y+me.game.viewport.pos.y);// getting the current tileid we've clicked on
					if (tileid != null){ // 22 it's for the construction tile
						var idVillage = 1; // -> NEED TO SEE THIS BETTER!
                        this.tileWhereBuildingIs = tileIs;
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


