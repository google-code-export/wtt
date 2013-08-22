jsApp.Timer = me.Renderable.extend({

	init : function init(time)
	{
		var BarW = 0;
		var timePass = 0;
		var timeTotal = time
		this.parent(new me.Vector2d(0,gameH-128,(5*32),32));// position on the screen
        this.floating = true;
        this.isPersistent = true;
		this.pos.y = 0
		/*while(time--){
			timePass = 	timePass + 1;
			
			var progressPercent = (100*timePass)/timeTotal;
			BarW = ((5*32)*progressPercent)/100;
			update();
		
		}*/
						  
		// add a tween to change the object pos.y variable to 200 in 3 seconds
		var tween = new me.Tween(this.pos.y).to({y: (5*32)}, time).onComplete(function()
																		{
																			me.game.remove(this,true);
																			me.game.sort();
																			tween.stop();
																		});
		tween.easing(me.Tween.Easing.Linear.EaseNone);
		tween.start();
		
	},
	
	
	draw : function(context)
	{
		// Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.1;
        context.fillStyle = "blue";
        context.fillRect(0, gameH-128,this.pos.y,32);
	},
	
	"update" : function update()
	{
		return this.visible;	
	
	},
	
	destroy : function()
	{
		
	}

});