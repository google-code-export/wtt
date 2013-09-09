jsApp.ColectAlert = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	"init" : function init(pixelIs)
	{
		me.game.sort();
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y),8,16);// position on the screen
		this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
		this.WoodValue	= 100;
        this.floating = false;
		this.isPersistent = false;
		this.alwaysUpdate = true;
		var tween = new me.Tween(this.pos).to({y: (this.pos.y + 8)}, 5000);
		var that = this;
		tween.onComplete(function(){
			me.game.remove(that);
		});
		tween.start();
	},


	"draw" : function(context)
	{
		context.drawImage(this.Woodimage, this.pos.x, this.pos.y);
        this.font.draw (context, "+"+this.WoodValue, this.pos.x, this.pos.y+10);
	},
	
	"update" : function update()
	{
		return true;
	},
	
	"destroy" : function destroy() 
	{

	}

});