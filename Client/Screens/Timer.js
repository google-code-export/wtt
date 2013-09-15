jsApp.Timer = me.Renderable.extend({

	init : function init(time,pixelIs)
	{
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y),64,8);// position on the screen
        this.buildTime = time;
        this.timeInit = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.timeEnd =  this.timeInit + this.buildTime;
        this.floating = false;
		this.isPersistent = true;
		this.alwaysUpdate = true;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;
        this.pos.y = 0;
		var tween = new me.Tween(this.pos).to({y: (64)}, time).onComplete((function(){me.game.remove(this,true);}).bind(this));
		tween.start();
		console.log(pixelIs);
	},


	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
        context.globalAlpha = 1;
        context.fillStyle = "blue";
        context.fillRect(this.pixelx, this.pixely,this.pos.y,8);
        context.globalAlpha = alpha;
		context.fillStyle = fillStyle;
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