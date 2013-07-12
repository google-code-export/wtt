PlayScreen = me.ScreenObject.extend(
    {
        onResetEvent: function () {
			var socket = jsApp.getSocket();
            var idVillage = 1; //-->NEED TO SEE THIS BETTER!!
			//Destroying websockets event before create a new one
			jsApp.destroy("onBuildingSelect");
            jsApp.destroy("onListVillageBuildings");
			jsApp.destroy("onRequestUpdate");
			
			 //HERE WE UPDATE AND CHANGE THE TILE IN THE RIGHT POSITION
			 socket.on("onRequestUpdate",function(data){
				var infobuild = gameHandler.activeHuds.buildingHUD;
				console.log("updating building idVillage:"+infobuild.idVillage+" x:"+infobuild.posX+" y:"+infobuild.posY+" idBuilding:"+infobuild.idBuilding);
				if(data[0][0].Msg == "Done"){
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile = infobuild.idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
					//NEED TO SEE THIS BETTER!
					//updating the resources
					gameHandler.activeHuds["resourceHud"].GoldValue -= infobuild.GoldValue;
					gameHandler.activeHuds["resourceHud"].StoneValue -= infobuild.StoneValue;
					gameHandler.activeHuds["resourceHud"].WoodValue -= infobuild.WoodValue;
					gameHandler.activeHuds["resourceHud"].IronValue -= infobuild.IronValue;
					//
				}else{
					alert(data[0][0].Msg);
				}
                 me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                 gameHandler.activeHuds.buildingHUD = undefined;
                 me.game.sort();
			 });
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


            this.parent();
            /////////////////
            // GAME CAMERA //
            /////////////////
            this.mousedown = false;
            this.mousemoved = false;
            this.mousemove = new me.Vector2d();
            this.mousedelta = new me.Vector2d();

            me.input.registerMouseEvent("mousedown", me.game.viewport, (function (e) {
                this.mousedown = true;
                this.mousemove = new me.Vector2d(
                    ~~me.input.touches[0].x,
                    ~~me.input.touches[0].y
                );

                //jsApp.simpleDialog("wololoeeeeiro");

                //IF I HAVE CLIKED IN THE BUILDING HUD,DO NOT REMOVE IT
                if(gameHandler.activeHuds.buildingHUD != undefined){
                    if(gameHandler.activeHuds.buildingHUD.UPRect.containsPoint(me.input.touches[0])){
						var updatebuild = gameHandler.activeHuds.buildingHUD;
						console.log(" request update building x:"+updatebuild.posX+" y:"+updatebuild.posY+" idBuilding:"+updatebuild.idBuilding);
						socket.emit("onRequestUpdate",{"idVillage" : updatebuild.idVillage, "idBuilding" : updatebuild.idBuilding, "posX": updatebuild.posX, "posY" : updatebuild.posY});
						if(gameHandler.activeHuds.buildingHUD.buildRect.containsPoint(me.input.touches[0])){
						}
                    }else{
                        //IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
                        me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                        gameHandler.activeHuds.buildingHUD = undefined;
                        me.game.sort();
                        //
                    }
                }else if(gameHandler.activeHuds.actionMenu != undefined && gameHandler.activeHuds.actionMenu.menuRect.containsPoint(me.input.touches[0])) {
                    var menu = gameHandler.activeHuds.actionMenu;
                    // if i clicked the menu
                    if(menu.menuRect != undefined) {
                        if (menu.menuRect.containsPoint(me.input.touches[0])) {
                            // if i clicked the "BUILD" button
                            if(menu.buildRect.containsPoint(me.input.touches[0])) {
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
					var tileIs = jsApp.getTileForPixels(me.input.touches[0].x, me.input.touches[0].y);
					var tileid = buildLayer.getTileId(me.input.touches[0].x+me.game.viewport.pos.x, me.input.touches[0].y+me.game.viewport.pos.y);// getting the current tileid we've clicked on
					if(tileid != null){
						var idVillage = 1; // -> NEED TO SEE THIS BETTER!
						socket.emit("onBuildingSelect",{idVillage: idVillage, X: tileIs.x, Y: tileIs.y});
					}
				}
                //
				        
            }).bind(this));

            me.input.registerMouseEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));

            me.input.registerMouseEvent("mousemove", me.game.viewport, (function (e) {
                if (this.mousedown == true) {

                    var pos = new me.Vector2d(
                        ~~me.input.touches[0].x,
                        ~~me.input.touches[0].y
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
            me.input.releaseMouseEvent("mousedown", me.game.viewport);
            me.input.releaseMouseEvent("mouseup", me.game.viewport);
            me.input.releaseMouseEvent("mousemove", me.game.viewport);
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


