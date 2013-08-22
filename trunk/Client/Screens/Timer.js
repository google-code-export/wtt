jsApp.Timer = me.Renderable.extend({

	init : function init(time,pixelIs)
	{
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y,0,8));// position on the screen
        this.floating = true;
        this.isPersistent = false;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;
		console.log("i added the tween");
        this.pos.y = 0;
        console.log(this.pos);
        console.log(time);
		// add a tween to change the object pos.y variable to 200 in 3 seconds
		var tween = new me.Tween(this.pos).to({y: (64)}, time).onComplete(function ()
																		{
																			me.game.remove(this,true);
																			me.game.sort();
																		});
		tween.start();
		
	},
	
	
	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 1;
        context.fillStyle = "blue";
        context.fillRect(this.pixelx, this.pixely,this.pos.y,8);
        context.globalAlpha = alpha;
	},
	
	"update" : function update()
	{
		return true;
	
	},
	
	destroy : function()
	{
	    this.parent();
	}

});