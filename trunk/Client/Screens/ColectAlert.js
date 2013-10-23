jsApp.ColectAlert = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	"init" : function init(pixelIs,type)
	{
		this.parent(new me.Vector2d(pixelIs.x,pixelIs.y),8,16);// position on the screen
		this.font = new me.BitmapFont("BaseFont", 16);
		
		
		if(type == 4){
			this.image  = me.loader.getImage("Wood") ;
			this.Value	= 100;
		}
		if(type == 14){
			this.image  = me.loader.getImage("Stone") ;
			this.Value	= 50;
		}
        this.floating = false;
		this.isPersistent = false;;
		this.alwaysUpdate = true;
		var tween = new me.Tween(this.pos).to({y: (this.pos.y + 8)}, 2500).onComplete((function() {
			me.game.remove(this,true)
		}).bind(this));
		tween.start();
	},


	"draw" : function(context)
	{
		context.drawImage(this.image, this.pos.x, this.pos.y);
        this.font.draw (context, "+"+this.Value, this.pos.x, this.pos.y+10);
	},
	
	"update" : function update()
	{
		return true;
	},
	

});