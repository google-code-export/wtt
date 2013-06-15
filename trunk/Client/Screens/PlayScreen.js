PlayScreen = me.ScreenObject.extend(
    {
        onResetEvent: function () {
			var socket = jsApp.getSocket();
            var idVillage = 1; //-->NEED TO SEE THIS BETTER!!
			jsApp.destroy("onBuildingSelect");
            jsApp.destroy("onListVillageBuildings");

             //HERE WE VERIFY IF THE CLICK RESULTS IN A BUILDING AND GET ALL THE DATA TO BUILD THE BUILDING HUD!
			socket.on('onBuildingSelect', function(data) {
                //console.log("Description:"+data[1].Description+" idBuilding:"+data[2].idBuilding+" wood:"+data[2].wood+" stone:"+data[2].stone+" iron:"+data[2].iron+" gold:"+data[2].gold);
                 console.log("data:"+data);
                $.each(data, function(i, obj) {
                    if(i>0)
                        return false;
                    else{
                        console.log("Basic Description:"+obj[i].basicDescription+" Description:"+obj[i].Description+" idBuilding:"+obj[i].idBuilding+" wood:"+obj[i].wood+" stone:"+obj[i].stone+" iron:"+obj[i].iron+" gold:"+obj[i].gold+" idTile:"+obj[i].idTile);
                        gameHandler.activeHuds.buildingHUD = new jsApp.BuildingHUD(obj[i]);
                        me.game.add(gameHandler.activeHuds.buildingHUD, 1100);
                        me.game.sort();
                    }
                });
            });
			//

            //HERE WE VERIFY THE BUILDINGS OF THE VILLAGE AND THEIR POSITION
            socket.on("onListVillageBuildings", function(data){
                var buildLayer =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
                for (var i in data[0]){
                    if (i!=0){
                        var idTile = data[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
                        var x      = data[0][i].posX;
                        var y      = data[0][i].posY;
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

                //IT'S NOT WORKING! NEED TO VERIFY
                //IF I HAVE CLIKED IN THE BUILDING HUD,DO NOT REMOVE IT
                if(gameHandler.activeHuds.buildingHUD != undefined){
                    if(gameHandler.activeHuds.buildingHUD.containsPoint(me.input.touches[0])){
                        alert("hey!");
                    }else{
                        //IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
                        me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                        gameHandler.activeHuds.buildingHUD = undefined;
                        me.game.sort();
                        //
                    }
                }
                //

                //JUST DO IT IF ANY HUD IT'S NOT ON THE SCREEN
				if((gameHandler.activeHuds.buildMenu == undefined) && (gameHandler.activeHuds.buildingArea == undefined)){

					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs = jsApp.getTileForPixels(me.input.touches[0].x, me.input.touches[0].y);
					var tileid = buildLayer.getTileId(me.input.touches[0].x, me.input.touches[0].y);//buildLayer.getTileId(tileIs.x, tileIs.y);// getting the current tileid we've clicked on
					
					if(tileid != null){
						var idVillage = 1; // -> NEED TO SEE THIS BETTER!
						socket.emit("onBuildingSelect",{idVillage: idVillage, X: tileIs.x, Y: tileIs.y});
					}
					console.log("tileid:"+tileid);
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


