jsApp.BuildingHUD = me.Renderable.extend({
    "init" : function init(infoBuild) {
        this.parent(new me.Vector2d(0,gameH-128,gameW,128));// position on the screen
        this.floating = true;
        this.isPersistent = true;

        this.msg        = infoBuild.Msg;
        this.WoodValue  = infoBuild.wood;
        this.StoneValue = infoBuild.stone;
        this.FoodValue  = infoBuild.food;
        this.IronValue  = infoBuild.iron;
        this.GoldValue  = infoBuild.gold;

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
        // DESCRIPTION
        // Me.Rect(x,y,Witdh,Height)
        this.DescRect = new me.Rect(
            new me.Vector2d(
                this.pos.x+128,
                this.pos.y
            ),
            (gameW/3), 128
        );
        var titletext = undefined;
        if(this.msg == undefined){titletext = infoBuild.basicDescription;}else{titletext = infoBuild.Description;}
        this.DescRect.TitleText = titletext.toUpperCase();
        this.DescRect.buildDesc = "THIS IS A BUILDING.";
        ////////

        // UPDATE
        // Me.Rect(x,y,Witdh,Height)
        this.UPRect = new me.Rect(
            new me.Vector2d(
                this.pos.x+((gameW/3)*2),
                this.pos.y
            ),
            (gameW/3), 128
        );
        this.UPRect.TitleText = "UPDATE";
        this.UPRect.buildDesc = infoBuild.Description.toUpperCase();

        this.buildRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +((gameW/3)*2)+64,
                this.pos.y+80
            ),
            70, 30
        );
        this.buildRect.buttonText = "UPDATE";
        this.buttonfont = new me.Font("verdana", 14, "lime", "right");
        this.buttonfont.textBaseline = "bottom";
        ////////
	},
	
    draw : function (context)
    {
        var iX = 20;
		context.globalAlpha = 1;
        context.fillStyle = "#00066";

        //BUILDING RECTS//
        context.fillRect(0,gameH-128,gameW, 128);
		context.drawImage(this.Buildimage, this.pos.x, this.pos.y)
        //

       //DESCRIPTION RECT//
        this.font.draw(context,this.DescRect.TitleText,this.pos.x+128, this.pos.y );
        this.font.draw(context,this.DescRect.buildDesc,this.pos.x+128, this.pos.y+64 );
        //

        //UPDATE RECT//
        this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
        if(this.msg != undefined){
            this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
            this.font.draw(context,this.msg.toUpperCase(),this.pos.x+((gameW/3)*2), this.pos.y+64 );
        }else{
            this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
            this.font.draw(context,this.UPRect.buildDesc,this.pos.x+((gameW/3)*2), this.pos.y+20 );

            //RESOURCES
            context.drawImage(this.Coinimage, this.pos.x+((gameW/3)*2), this.pos.y+40);
            this.font.draw (context, this.GoldValue, this.pos.x+((gameW/3)*2)+iX , this.pos.y+40);
            iX += this.GoldValue.toString().length*16+20;

            context.drawImage(this.Woodimage, this.pos.x+((gameW/3)*2)+iX , this.pos.y+40);
            iX += 20;
            this.font.draw(context, this.WoodValue, this.pos.x+((gameW/3)*2)+iX, this.pos.y+40);
            iX += this.WoodValue.toString().length*16+20;

            context.drawImage(this.Stoneimage, this.pos.x+((gameW/3)*2) + iX, this.pos.y+40);
            iX+=20;
            this.font.draw (context, this.StoneValue, this.pos.x+((gameW/3)*2) +iX, this.pos.y+40);

            context.drawImage(this.Ironimage, this.pos.x+((gameW/3)*2), this.pos.y+60);
            iX=20;
            this.font.draw (context, this.IronValue, this.pos.x+((gameW/3)*2) +iX, this.pos.y+60);

            context.fillStyle = "#585858";
            context.fillRect(this.buildRect.pos.x, this.buildRect.pos.y, this.buildRect.width, this.buildRect.height);
            this.buttonfont.draw(context, this.buildRect.buttonText, this.buildRect.pos.x + this.buildRect.width - 8, this.buildRect.pos.y + this.buildRect.height - 8);

            //
        }
        //
    },

    "destroy" : function() {

    }

});
