jsApp.WorldNames = me.Renderable.extend({
	//INIT OF THE CLASS, TIME = MS AND PIXELIS = X AND Y //
	"init" : function init(villageInfo)
	{
		this.parent(new me.Vector2d(villageInfo.x,villageInfo.y),8,16);// position on the screen
		this.font         = new me.Font("verdana", 18, "white", "left");
        this.floating     = false;
		this.isPersistent = false;
		this.alwaysUpdate = true;
		this.villageInfo  = villageInfo;
		if(this.villageInfo.playerName == null){this.villageInfo.playerName = "";}
	},


	"draw" : function(context)
	{
		var alpha     = context.globalAlpha;
		var fillstyle = context.fillStyle;
		context.globalAlpha = 1;
		this.font.draw(context, this.villageInfo.playerName, this.pos.x, this.pos.y);
		context.globalAlpha = alpha;
		context.fillStyle   = fillstyle;
	},
	
	"update" : function update()
	{
		return true;
	},
	
});