jsApp.BuildingHUD = me.Renderable.extend({
    "init" : function init(infoBuild) {
        this.parent(new me.Vector2d(0,gameH-128,gameW,128));// position on the screen
        this.floating = true;
        this.isPersistent = true;

        this.WoodValue = 0;
        this.StoneValue = 0;
        this.FoodValue = 0;
        this.IronValue = 0;
        this.GoldValue = 0;

        this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
        this.Stoneimage = me.loader.getImage("Stone");
        this.Ironimage  = me.loader.getImage("Iron") ;
        this.Meatimage  = me.loader.getImage("Meat") ;
        this.Coinimage  = me.loader.getImage("Coin") ;
		this.Buildimage = me.loader.getImage("BuildImg");
        gameHandler.activeHuds["buildingHUD"] = this;
		
		//////////////////////////
        // BUILDING INFORMATION //
        //////////////////////////
		
        // IMAGE
		// Me.Rect(x,y,Witdh,Height)
		this.ImgRect = new me.Rect(
            new me.Vector2d(
                this.pos.x,
                this.pos.y
             ),
             128, 128
        );
        this.ImgRect.buttonText = "Image";
		this.ImgRect.img = this.Buildimage;
		////////
	},
	
    draw : function (context, x, y)
    {
        //var iX = 20;
		context.globalAlpha = 1;
        context.fillStyle = "#00066";

        context.fillRect(0,gameH-128,gameW, 128);
        
		
		if(context.img != undefined){
			context.drawImage(context.img, this.pos.x, this.pos.y)
		
		}
        /*context.drawImage(this.Coinimage, this.pos.x, this.pos.y);
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
        this.font.draw (context, this.FoodValue, this.pos.x +iX, this.pos.y);*/
    },

    "destroy" : function() {

    }

});
