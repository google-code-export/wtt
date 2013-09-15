jsApp.VillageUnitsGeneral = me.Renderable.extend({
    "init" : function init(listUnits, listClasses) {
        this.parent(new me.Vector2d(gameW/10, gameH/10), gameW-(gameW/10)*2, (gameH/10)*8);// position on the screen
        this.floating = true;
        this.listUnits = listUnits;
        this.listClasses = listClasses;
        this.isPersistent = true;
        this.titleFont = new me.Font("verdana", 18, "white", "right");
        ///////////////////////////
        // Declaring All Options //
        ///////////////////////////
		// Me.Rect(x,y,Witdh,Height)
        //Creating the HUD
        this.menuRect = new me.Rect(
            new me.Vector2d(
                this.pos.x ,
                this.pos.y
            ),
            this.width,
            this.height
        );


        // Me.Rect(x,y,Witdh,Height)
        this.backRect = new me.Rect(
            new me.Vector2d(
                this.pos.x + 615,
                this.pos.y - 5
            ),
            30, 30
        );

        this.backRect.buttonColor = "red";
        this.backRect.buttonText = "X";
        this.backRect.hasClickFunction = true;

        //////////////////////
        // POSSIBLE BUTTONS //
        //////////////////////
        // BUILD
		// Me.Rect(x,y,Witdh,Height)

        me.input.registerPointerEvent("mouseup", this,function(){
            // if i clicked the menu
            if (this.menuRect.containsPointV(me.input.changedTouches[0])) {
                if (this.backRect.containsPointV(me.input.changedTouches[0])) {
                    me.game.remove(this,true);
                    me.game.sort();
                }
            }
		}.bind(this));

    },

    "destroy" : function destroy() {
        //Removing mouse events and huds
        me.input.releasePointerEvent("mousemove", this);
        me.input.releasePointerEvent("mousedown", this);
		me.input.releasePointerEvent("mouseup", this);
        gameHandler.activeHuds.villageUnitsGeneral = undefined;
    },

    "update" : function update() {
        return this.visible;
    },
	
    "draw" : function(context) {
        //All this content it's only for drawing
        //size,colors,positions
        // Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
        context.globalAlpha = 0.6;
        context.fillStyle = "#00066";

        var ct = this.listClasses.length;
        var iX = this.pos.x + 25;
        var iY = this.pos.y + 25;
        while(ct--) {
            context.fillRect(iX, iY, 100, 20);
            iY += 25;
        }

        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        context.fillRect(this.backRect.pos.x, this.backRect.pos.y, this.backRect.width, this.backRect.height);
        this.titleFont.draw(
            context,
            "X",
            this.backRect.pos.x+21,
            this.backRect.pos.y+9
        );

        context.fillStyle = "#00066";
        context.globalAlpha = alpha;
        this.titleFont.draw(
            context,
            "Village Units",
            gameW/3,
            gameH/8
        );

        context.globalAlpha = alpha;
		context.fillStyle = fillStyle;

    }
});