jsApp.TempleTimeOut = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	init : function init(time)
	{
		console.log(time);
		this.parent(new me.Vector2d(40,gameW/2),64,8);// position on the screen
        this.ConquestTime = time;
        this.progressBar  = 0;
		this.font         = new me.Font("verdana", 14, "lime", "right");

        this.floating     = true;
		this.isPersistent = true;;
		this.alwaysUpdate = true;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;

		this.Timer = "";
		this.timerCountDown = jsApp.timeToMs(time);
		this.initTime = me.timer.getTime();
		console.log(this.timerCountDown);
		console.log(this.initTime);
	},


	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
        context.globalAlpha = 1;
		this.font.draw(context,this.Timer,40, gameW/2);
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