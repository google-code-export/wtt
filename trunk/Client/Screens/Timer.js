jsApp.Timer = me.Renderable.extend({

	init : function init()
	{
		this.parent(new me.Vector2d(0,gameH-128,0,32));// position on the screen
        this.floating = true;
        this.isPersistent = true;
	},
	
	
	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.1;
        context.fillStyle = "blue";
        context.fillRect(gameH-128, 0,32,5*32);
	},
	
	destroy : function()
	{
		
	}

});