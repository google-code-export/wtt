var OutWorldScreen = me.ScreenObject.extend(
    {
		
        onResetEvent: function (worldVillages) {
			var socket         			 = jsApp.getSocket();
            var idWorld        			 = 1; //-->NEED TO SEE THIS BETTER!!
			this.TMXTileMap   			 = "Chunk";
			this.font          			 = new me.Font("verdana", 18, "white", "left");
			//Destroying websockets event before create a new one
			 jsApp.destroy("onBuildingSelect");
             jsApp.destroy("onListVillageBuildings");
			 jsApp.destroy("onRequestUpdate");
			 jsApp.destroy("onConstruct");
			 jsApp.destroy("onResourcesUpdate");
			 jsApp.destroy("onCheckUpdate");
			 jsApp.destroy("onConstructRequest");
			 jsApp.destroy("onConstructCheck");
			 jsApp.destroy("onRequestUnit");
			 jsApp.destroy("onUnitCheck");
			 jsApp.destroy("onListBuilding");
			 jsApp.destroy("onResourcesCollect");
			 jsApp.destroy("onSellMenu");	
			
			////////////////////////////////////
			//WORLD SOCKETS			         //
			//////////////////////////////////
			socket.on("onListWorldVillage", function(rows){
                var buildLayer    =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
				var worldVillages = new Array();
                for (var i in rows[0]){
                    if (i!="remove"){
                        var idTile      = rows[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
						var pixelIs     = jsApp.getTileForPixels(rows[0][i].posX,rows[0][i].posY);
						var x		    = rows[0][i].posX;
						var y		    = rows[0][i].posY;
						var playerName  = rows[0][i].Nick;
						var villageInfo = {"playerName" : playerName, "x" : pixelIs.x, "y" : pixelIs.y};
                        buildLayer.setTile(x,y,idTile);//changing the tile
						var names = new jsApp.WorldNames(villageInfo);
						me.game.add(names,10);
                    }
                }
            });
			
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
				
				//IF I HAVE ANY WORLD VILLAGE ACTION MENU OPEN
				if(gameHandler.activeHuds.actionWorldMenu != undefined){
					//IF I CLICKED IN 'ENTER' BUTTON
					if(gameHandler.activeHuds.actionWorldMenu.enterRect.containsPointV(me.input.changedTouches[0])){
					}
					
					//IF I CLICKED IN 'ATTACK' BUTTON
					else if(gameHandler.activeHuds.actionWorldMenu.attackRect.containsPointV(me.input.changedTouches[0])){
					}
				
					//IF I CLICKED IN 'TRADE' BUTTON
					else if(gameHandler.activeHuds.actionWorldMenu.tradeRect.containsPointV(me.input.changedTouches[0])){
					}
					
					//IF I CLICKED IN 'SEND MSG' BUTTON
					else if(gameHandler.activeHuds.actionWorldMenu.msgRect.containsPointV(me.input.changedTouches[0])){
					}
					else{
						//IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
						me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
						gameHandler.activeHuds.actionWorldMenu = undefined;
					}
					//
				//IF I DONT HAVE ANY WORLD VILLAGE ACTION MENU OPEN
				}else{
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs     = jsApp.getPixelsForTile(me.input.changedTouches[0].x, me.input.changedTouches[0].y);
					var pixelIs    = jsApp.getTileForPixels(tileIs.x,tileIs.y);
					var tileid     = buildLayer.getTileId(me.input.changedTouches[0].x+me.game.viewport.pos.x, me.input.changedTouches[0].y+me.game.viewport.pos.y);// getting the current tileid we've clicked on
					//IF I CLICKED IN SOMETHING I'LL SEE WHAT IT'S AND CREATE A ACTION MENU
					if (tileid == 11){ 
						var actionWorldMenu = new jsApp.WorldBuildingOptions('',pixelIs);
						me.game.add(actionWorldMenu,10);
						me.game.sort();
					}
				}
				
            }).bind(this));

            me.input.registerPointerEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));
			
			//MOVES GAME CAMERA
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
			
			//ADD ACTION GUI TO THE SCREEN
			this.gui = new jsApp.ActionMenu("World");
			me.game.add(this.gui, 1000);
			
            // LOADS THE MAIN MAP (DEBUG, WILL CHANGE)
            loadMap("Chunk");
            // SORT GRAPHICS RENDERED TO THE SCREEN (SO IT CAN REDRAW IN THE RIGHT ORDER)
            //me.game.sort();
			this.parent();
        },
		
        "draw": function (context) {
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
        onDestroyEvent: function() {
            me.input.releasePointerEvent("mousedown", me.game.viewport);
            me.input.releasePointerEvent("mouseup", me.game.viewport);
            me.input.releasePointerEvent("mousemove", me.game.viewport);
            me.game.disableHUD();
			me.game.sort();
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


