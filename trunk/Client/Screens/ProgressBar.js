jsApp.ProgressBar = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	init : function init(time,pixelIs)
	{
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y),64,8);// position on the screen
        this.buildTime = time;
        this.progressBar = 0;
        this.timeInit = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.timeEnd =  this.timeInit + this.buildTime;
        this.floating = false;
		this.isPersistent = false;;
		this.alwaysUpdate = true;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;
		this.barColor = "red";
	},


	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
        context.globalAlpha = 1;
        context.fillStyle = this.barColor;
        context.fillRect(this.pos.x, this.pos.y,this.progressBar,8);
        context.globalAlpha = alpha;
		context.fillStyle = fillStyle;
	},
	
	"update" : function update()
	{
        this.actualTime = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.buildProgress = (100*(this.actualTime - this.timeInit))/this.buildTime;
		if(this.buildProgress <= 35){
			this.barColor = "red";
		}else if((this.buildProgress > 35) && (this.buildProgress <= 75)){
			this.barColor = "yellow";
		}else{
			this.barColor = "green";
		}
        this.progressBar = (64*this.buildProgress)/100;
        if(this.actualTime >= this.timeEnd){
            me.game.remove(this);

        }
		return true;
	
	},
	
	destroy : function()
	{
	
	}

});