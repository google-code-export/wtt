jsApp.Timer = me.Renderable.extend({

	init : function init(time,pixelIs)
	{
        this.buildTime = time;
        this.timeInit = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.timeEnd =  this.timeInit + this.buildTime;
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y,0,8));// position on the screen
        this.floating = true;
        this.isPersistent = false;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;

	},


	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 1;
        context.fillStyle = "blue";
        context.fillRect(this.pixelx, this.pixely,this.pos.y,8);
        //context.fillRect(10, 10,this.pos.y,8);
        context.globalAlpha = alpha;
	},
	
	"update" : function update()
	{
        this.actualTime = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.buildProgress = (100*(this.actualTime - this.timeInit))/this.buildTime;
        this.pos.y = (64*this.buildProgress)/100;

        if(this.actualTime >= this.timeEnd){
            me.game.remove(this);

        }
		return true;
	
	},
	
	destroy : function()
	{
	
	}

});