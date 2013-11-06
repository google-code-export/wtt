jsApp.ResourcesHUD = me.Renderable.extend({
// create a "score object" that will use a Bitmap font
// to display the score value

    "init" : function init() {
        this.parent(new me.Vector2d(5,5),gameW,30);// position on the screen
        this.floating = true;
        this.isPersistent = false;

        this.WoodValue = 0;
        this.StoneValue = 0;
        this.FoodValue = 0;
        this.IronValue = 0;
        this.GoldValue = 0;

        this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
        this.Stoneimage = me.loader.getImage("Stone");
        this.Ironimage  = me.loader.getImage("Iron") ;
        this.Meatimage  = me.loader.getImage("Food") ;
        this.Coinimage  = me.loader.getImage("Gold") ;
        gameHandler.activeHuds["resourceHud"] = this;
		
        jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
		this.background = me.loader.getImage("WoodTexture");
    },

    distance : 60,

    // separate function so you dont need to calculate resources X and Y every draw frame
    calculatePositions : function () {

    },

    draw : function (context, x, y)
    {
        var iX = 20;
		var alpha = context.globalAlpha; 
		context.drawImage(this.background, 0, 0, gameW, 30);
        context.globalAlpha = 0.6;
        context.fillStyle = "#00066";

        //context.fillRect(0,0,gameW, 28);
        context.globalAlpha = 1;
        context.drawImage(this.Coinimage, this.pos.x, this.pos.y);
        this.font.draw (context, this.GoldValue, iX+this.pos.x , this.pos.y);

        iX += this.GoldValue.toString().length*16+20;
        context.drawImage(this.Woodimage, this.pos.x + iX, this.pos.y);
        iX += 20;
        this.font.draw (context, this.WoodValue, this.pos.x +iX, this.pos.y);

        iX += this.WoodValue.toString().length*16+20;
        context.drawImage(this.Stoneimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.StoneValue, this.pos.x +iX, this.pos.y);

        iX += this.StoneValue.toString().length*16+20;
        context.drawImage(this.Ironimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.IronValue, this.pos.x +iX, this.pos.y);

        iX += this.IronValue.toString().length*16+20;
        context.drawImage(this.Meatimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.FoodValue, this.pos.x +iX, this.pos.y);
		context.globalAlpha = alpha;
    },

    "destroy" : function() {
        //remove socket connection
        jsApp.destroy("onResourcesUpdate");
    }

});
