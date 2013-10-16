var OutWorldScreen = me.ScreenObject.extend(
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
			 jsApp.destroy("onCheckUpdate");
			 jsApp.destroy("onConstructRequest");
			 jsApp.destroy("onConstructCheck");
			 jsApp.destroy("onRequestUnit");
			 jsApp.destroy("onUnitCheck");
			 jsApp.destroy("onListBuilding");
			 jsApp.destroy("onResourcesCollect");
			 jsApp.destroy("onSellMenu");	
			
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

			this.gui = new jsApp.ActionMenu("World");
			me.game.add(this.gui, 1000);
			
            // LOADS THE MAIN MAP (DEBUG, WILL CHANGE)
            loadMap("Chunk");
            // SORT GRAPHICS RENDERED TO THE SCREEN (SO IT CAN REDRAW IN THE RIGHT ORDER)
            //me.game.sort();
			this.parent();
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


