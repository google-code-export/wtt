jsApp.TempleTimeOut = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	init : function init(time)
	{
		this.parent(new me.Vector2d(gameW/2,30),64,8);// position on the screen
        this.ConquestTime = time;
        this.progressBar  = 0;
		this.font         = new me.Font("verdana", 20, "white", "center");

        this.floating     = true;
		this.isPersistent = false;
		this.alwaysUpdate = true;

		this.Timer = "";
		this.timerCountDown = jsApp.timeToMs(time);
		this.initTime = me.timer.getTime();
	},


	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
        context.globalAlpha = 1;
		this.font.draw(context,this.Timer,this.pos.x, this.pos.y);
        context.globalAlpha = alpha;
		context.fillStyle = fillStyle;
	},
	
	"update" : function update()
	{
		//here it's where i calculate the progress time in the HUD//
        if(this.initTime != undefined){
            var total = this.timerCountDown;
            var progressTime = me.timer.getTime() - this.initTime;
            if(progressTime <= total){
                this.Timer = jsApp.msToTime(total - progressTime);
			}else{
				me.game.remove(this);
			}
        }
        return true;
	
	},
	
	destroy : function()
	{
	
	}

});