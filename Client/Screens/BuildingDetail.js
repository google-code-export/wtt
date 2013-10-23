jsApp.BuildingDetail = me.Renderable.extend({
    "init" : function init(buildList) {
        this.parent(new me.Vector2d(gameW/20, gameH/20), gameW-(gameW/20)*2, (gameH/20)*8);// position on the screen
        this.floating = true;
        this.isPersistent = false;
		this.mouseAction = undefined;//binding variable for mouse actions

        // Declaring All Options //
        ///////////////////////////
		// Me.Rect(x,y,Witdh,Height)
        //Creating the HUD
        this.buildDetailRect = new me.Rect(
            new me.Vector2d(
                this.pos.x ,
                this.pos.y
            ),
            this.width,
            this.height
        );
	},
	
	"destroy" : function destroy() {
		
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
        context.globalAlpha = 2;
        context.fillStyle = "#00066";

        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
	
});