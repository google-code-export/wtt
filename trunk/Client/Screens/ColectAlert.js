jsApp.ColectAlert = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	init : function init(pixelIs)
	{
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y),8,16);// position on the screen
        //this.ColectTime = time;
		this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
		this.WoodValue	= 100;
		
        this.timeInit = jsApp.timeToMs(jsApp.getSystemDate("time"));
        this.timeEnd =  this.timeInit + this.buildTime;
        this.floating = false;
		this.isPersistent = true;
		this.alwaysUpdate = true;
        this.pixely = pixelIs.y;
        this.pixelx = pixelIs.x;

		var tween = new me.Tween(this.pos).to({y: (this.pos.y + 8)}, 5000).onComplete((function(){
																				//updating the resources
																				jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
																				//
																				var resourceColect = function(){me.game.add(new jsApp.ColectAlert(pixelIs),10);} 
																				jsApp.timeScheduler(resourceColect,5000);
																				me.game.remove(this,true);
																			}).bind(this));
		tween.start();
		me.game.sort();
	},


	draw : function(context)
	{
		context.drawImage(this.Woodimage, this.pos.x, this.pos.y);
        this.font.draw (context, "+"+this.WoodValue, this.pos.x, this.pos.y+10);
	},
	
	"update" : function update()
	{
		return true;
	},
	
	destroy : function()
	{
	
	}

});