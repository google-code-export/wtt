jsApp.BuildingHUD = me.Renderable.extend({

    "init" : function init(infoBuild,data) {
        var socket  = jsApp.getSocket();
        this.upInfo = infoBuild ;
		this.pixelIs = data.pixelIs
		console.log(infoBuild);
		this.mouseAction = undefined;
		this.parent(new me.Vector2d(0,gameH-128));
        this.floating = true;
        this.isPersistent = false;
		this.alwaysUpdate = true;
		
		//LOADING IMAGES
        this.font 		= new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
        this.Stoneimage = me.loader.getImage("Stone");
        this.Ironimage  = me.loader.getImage("Iron") ;
        this.Meatimage  = me.loader.getImage("Food") ;
        this.Coinimage  = me.loader.getImage("Gold") ;
		this.Clockimage = me.loader.getImage("Clock") ;
		this.Buildimage = me.loader.getImage("BuildImg");

        this.rectangle = new me.Rect(
            new me.Vector2d(
                0,
                gameH-128
            )
            ,gameW,128
        )
		
		//IF THIS BUILDING IT'S A MARKET
		if(infoBuild.idBuilding == 11){
			this.sellMarketButton = new me.Rect(
                new me.Vector2d(
                    this.pos.x+132,
                    this.pos.y+21
                ),
                70, 30
            );
			
			this.buyMarketButton = new me.Rect(
                new me.Vector2d(
                    this.pos.x+222,
                    this.pos.y+21
                ),
                70, 30
            );
		}		
		
		//	
		
		//IF THIS BUILDING IT'S A MERCENARY DEN
		if(infoBuild.idBuilding == 12){
			this.sellDenButton = new me.Rect(
                new me.Vector2d(
                    this.pos.x+132,
                    this.pos.y+21
                ),
                70, 30
            );
			
			this.buyDenButton = new me.Rect(
                new me.Vector2d(
                    this.pos.x+222,
                    this.pos.y+21
                ),
                70, 30
            );
		}
		//	
		
		//IF THIS BUILDING HAVE UNITS
        this.createUnitButton = undefined;
        if(infoBuild.listUnitsCanMake.length >0) {
            this.createUnitButton = new me.Rect(
                new me.Vector2d(
                    this.pos.x+132,
                    this.pos.y+21
                ),
                160, 30
            );
        }

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
        // TIMER
        // Me.Rect(x,y,Witdh,Height)
        this.TimerRect = new me.Rect(
            new me.Vector2d(
                this.pos.x+128,
                this.pos.y-64
            ),
            (gameW/3), 128
        );
        var titletext = undefined;
		//if this is contructing or updating do this//
		if(this.upInfo.idUnit != undefined){
			this.upInfo.Image = this.upInfo.Image.replace(" ","_");
			var isMount       = this.upInfo.Image.indexOf('Mount');
			var isLadder      = this.upInfo.Image.indexOf('Ladder');
			var isCatapult    = this.upInfo.Image.indexOf('Catapult');
			var imgH = 48;
			var imgW = 40;
			if( isMount != -1){
				var imgH = 78;
				var imgW = 75;
			}
			if( isLadder != -1){
				var imgH = 75;
				var imgW = 32.5;
			}
			if( isCatapult != -1 ){
				var imgH = 55;
				var imgW = 42;			
			}
			this.unit = new me.Rect(
                new me.Vector2d(
                    this.pos.x+128,
                    this.pos.y+126
                ),
                120, 200
            );
            this.unit.icon = new me.AnimationSheet(
                0, 0,
                me.loader.getImage(this.upInfo.Image+"_Front"),
                imgW, imgH
            );
            this.unit.icon.floating = true;
			this.unit.icon.addAnimation("anim", [0]);
            this.unit.icon.setCurrentAnimation('anim');
            this.unit.icon.setAnimationFrame(0);
			this.DescRect.buildDesc = this.upInfo.Image.toUpperCase();
		}else{
			this.DescRect.buildDesc = "THIS IS A BUILDING.";
			this.unit = "undefined";
		}
        if(this.upInfo.Timer != undefined){
            titletext = infoBuild.Description;
            this.DescRect.TitleText = titletext.toUpperCase();
            this.TimerRect.countDown = jsApp.timeToMs(infoBuild.Timer);
            this.TimerRect.initTime = me.timer.getTime();
        }else{
			if(infoBuild.basicDescription == undefined){
				titletext = infoBuild.Description;
				this.DescRect.TitleText = titletext.toUpperCase();
			}else{
				titletext = infoBuild.basicDescription;
				this.DescRect.TitleText = titletext.toUpperCase();
			}
        }
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
        if(this.upInfo.idUnit != undefined){
			this.UPRect.TitleText = "TRAINING";
		}else if(this.upInfo.Timer != undefined){
			this.UPRect.TitleText = "UPDATING";
		}else{
			this.UPRect.TitleText = "";
		}
        this.UPRect.buildDesc = infoBuild.Description.toUpperCase();
        this.buildRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +((gameW/3)*2)+64,
                this.pos.y+80
            ),
            140, 30
        );
        this.buildRect.buttonText = "UPDATE";
        this.buttonfont = new me.Font("verdana", 14, "lime", "right");
        this.buttonfont.textBaseline = "bottom";
        ////////
		this.background  = me.loader.getImage("WoodTexture");
		this.selectedImg = me.loader.getImage("Selected");
		//this.selectedImg.parent(new me.Vector2d(pixelIs.x,pixelIs.y), 64, 64);
		gameHandler.activeHuds.buildingHUD = this;
	},

    draw : function (context)
    {
        var iX = 20;
		context.globalAlpha = 0.9;
        context.fillStyle = "#00066";
		
		//PRINTING SELECTED IMG ON THE BUILDING//
		context.drawImage(this.selectedImg, this.pixelIs.x-me.game.viewport.pos.x, this.pixelIs.y-me.game.viewport.pos.y, 64,64);
		
        //BUILDING RECTS//
		context.drawImage(this.background,0,gameH-128,gameW, 128);
        //context.fillRect(0,gameH-128,gameW, 128);
        context.globalAlpha = 1;

		context.drawImage(this.Buildimage, this.pos.x, this.pos.y);
		
        //

       //DESCRIPTION RECT//
        this.font.draw(context,this.DescRect.TitleText,this.pos.x+128, this.pos.y );
		if(this.upInfo.idUnit != undefined){
			this.font.draw(context,this.DescRect.buildDesc,this.pos.x+215, this.pos.y+64 );
				if(this.unit.icon != undefined) {
                    if(this.unit.hasRendered == undefined) {
                        this.unit.hasRendered = true;
                        this.unit.icon.pos.x = this.pos.x+160;
                        this.unit.icon.pos.y = this.pos.y+30;
                        this.unit.width = this.unit.icon.width;
                        this.unit.height = this.unit.icon.height;
                        me.game.add(this.unit.icon, 10000);
                        me.game.sort();
                    }
                }
		}else{
			this.font.draw(context,this.DescRect.buildDesc,this.pos.x+128, this.pos.y+64 );
			// BUILD MARKET BUTTONS
			if( this.sellMarketButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.sellMarketButton.pos.x, this.sellMarketButton.pos.y, this.sellMarketButton.width, this.sellMarketButton.height);
				this.font.draw(context,"SELL",this.sellMarketButton.pos.x+1, this.sellMarketButton.pos.y +5 );
			}
			
			if( this.buyMarketButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.buyMarketButton.pos.x, this.buyMarketButton.pos.y, this.buyMarketButton.width, this.buyMarketButton.height);
				this.font.draw(context,"BUY",this.buyMarketButton.pos.x+1, this.buyMarketButton.pos.y +5 );
			}
			////////////////////////////
			
			// BUILD DEN BUTTONS
			if( this.sellDenButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.sellDenButton.pos.x, this.sellDenButton.pos.y, this.sellDenButton.width, this.sellDenButton.height);
				this.font.draw(context,"SELL",this.sellDenButton.pos.x+1, this.sellDenButton.pos.y +5 );
			}
			
			if( this.buyDenButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.buyDenButton.pos.x, this.buyDenButton.pos.y, this.buyDenButton.width, this.buyDenButton.height);
				this.font.draw(context,"BUY",this.buyDenButton.pos.x+1, this.buyDenButton.pos.y +5 );
			}
			////////////////////////////
			
			// BUILD UNIT BUTTON
			if( this.createUnitButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.createUnitButton.pos.x, this.createUnitButton.pos.y, this.createUnitButton.width, this.createUnitButton.height);
				this.font.draw(context,"TRAIN UNIT",this.createUnitButton.pos.x+1, this.createUnitButton.pos.y +5 );
			}
			////////////////////////////
			context.fillStyle = "#00066";
		}
        //

        //UPDATE RECT//
        this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );

		//if the building it's constructing or updating it'll draw this//
        if(this.upInfo.Timer != undefined){
            this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
            this.font.draw(context,this.upInfo.Timer,this.pos.x+((gameW/3)*2), this.pos.y+64 );
			
		//if not, it'll draw all the other information //
        }else{
            if(this.upInfo.Msg != undefined){
                this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
                this.font.draw(context,this.upInfo.Msg.toUpperCase(),this.pos.x+((gameW/3)*2), this.pos.y+64 );
            }else{
                this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
                this.font.draw(context,this.UPRect.buildDesc,this.pos.x+((gameW/3)*2), this.pos.y+20 );

                //RESOURCES
                context.drawImage(this.Coinimage, this.pos.x+((gameW/3)*2), this.pos.y+40);
                this.font.draw (context, this.upInfo.gold, this.pos.x+((gameW/3)*2)+iX , this.pos.y+40);
                iX += this.upInfo.gold.toString().length*16+20;

                context.drawImage(this.Woodimage, this.pos.x+((gameW/3)*2)+iX , this.pos.y+40);
                iX += 20;
                this.font.draw(context, this.upInfo.wood, this.pos.x+((gameW/3)*2)+iX, this.pos.y+40);
                iX += this.upInfo.wood.toString().length*16+20;

                context.drawImage(this.Stoneimage, this.pos.x+((gameW/3)*2) + iX, this.pos.y+40);
                iX+=20;
                this.font.draw (context, this.upInfo.stone, this.pos.x+((gameW/3)*2) +iX, this.pos.y+40);

                context.drawImage(this.Ironimage, this.pos.x+((gameW/3)*2), this.pos.y+60);
                iX=20;
                this.font.draw (context, this.upInfo.iron, this.pos.x+((gameW/3)*2) +iX, this.pos.y+60);
				iX += this.upInfo.iron.toString().length*16+20;
				
				context.drawImage(this.Clockimage, this.pos.x+((gameW/3)*2) + iX, this.pos.y+60);
                iX+=20;
                this.font.draw (context, this.upInfo.buildTimer, this.pos.x+((gameW/3)*2) +iX, this.pos.y+60);
				
                context.fillStyle = "#585858";
                context.fillRect(this.buildRect.pos.x, this.buildRect.pos.y, this.buildRect.width, this.buildRect.height);
                this.buttonfont.draw(context, this.buildRect.buttonText, this.buildRect.pos.x + this.buildRect.width - 8, this.buildRect.pos.y + this.buildRect.height - 8);
            }

        }

    },

    "destroy" : function() {
		me.game.remove(this.unit.icon);
		me.game.remove(this.selectedImg);
        gameHandler.activeHuds.buildingHUD = undefined;
		me.input.releasePointerEvent("mousedown", this);
		me.input.releasePointerEvent("mouseup", this);
		me.input.releasePointerEvent("mousemove", this);
    },
    "update" : function() {	
		//here it's where i calculate the progress time in the HUD//
        if(this.TimerRect.initTime != undefined){
            var total = this.TimerRect.countDown;
            var progressTime = me.timer.getTime() - this.TimerRect.initTime;
            if(progressTime <= total){
                this.upInfo.Timer = jsApp.msToTime(total - progressTime);
			}else{
				me.game.remove(this);
			}
        }
        return true;
    }
});
