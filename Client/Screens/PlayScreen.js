PlayScreen = me.ScreenObject.extend(
    {
        onResetEvent: function () {
            this.parent();
            /////////////////
            // GAME CAMERA //
            /////////////////
            this.mousedown = false;
            this.mousemoved = false;
            this.mousemove = new me.Vector2d();
            this.mousedelta = new me.Vector2d();

            //gameHandler.playScreen = this;

            me.input.registerMouseEvent("mousedown", me.game.viewport, (function (e) {
                this.mousedown = true;
                this.mousemove = new me.Vector2d(
                    ~~me.input.touches[0].x,
                    ~~me.input.touches[0].y
                );

                var tileIs = jsApp.getTileForPixels(me.input.touches[0].x, me.input.touches[0].y);

            }).bind(this));

            me.input.registerMouseEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));

            me.input.registerMouseEvent("mousemove", me.game.viewport, (function (e) {
                if (this.mousedown) {

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

