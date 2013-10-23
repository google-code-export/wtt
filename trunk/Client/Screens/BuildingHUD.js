jsApp.BuildingHUD = me.Renderable.extend({

    "init" : function init(infoBuild) {
        var socket  = jsApp.getSocket();
        this.upInfo = infoBuild ;
        console.log("Opening info building ");
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
        this.Coinimage  = me.loader.getImage("Coin") ;
		this.Clockimage = me.loader.getImage("Clock") ;
		this.Buildimage = me.loader.getImage("BuildImg");

        this.rectangle = new me.Rect(
            new me.Vector2d(
                0,
                gameH-128
            )
            ,gameW,128
        )

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
			this.unit = new me.Rect(
                new me.Vector2d(
                    this.pos.x+128,
                    this.pos.y+126
                ),
                120, 200
            );
            this.unit.icon = new me.AnimationSheet(
                0, 0,
                me.loader.getImage(this.upInfo.Image),
                14, 18
            );
            this.unit.icon.floating = true;
			this.unit.icon.addAnimation("anim", [0]);
            this.unit.icon.setCurrentAnimation('anim');
            this.unit.icon.resize(3);
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
        this.UPRect.TitleText = "UPDATE";
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

		gameHandler.activeHuds.buildingHUD = this;
	},

    draw : function (context)
    {
        var iX = 20;
		context.globalAlpha = 0.9;
        context.fillStyle = "#00066";

        //BUILDING RECTS//
        context.fillRect(0,gameH-128,gameW, 128);
        context.globalAlpha = 1;

		context.drawImage(this.Buildimage, this.pos.x, this.pos.y);
        //

       //DESCRIPTION RECT//
        this.font.draw(context,this.DescRect.TitleText,this.pos.x+128, this.pos.y );
		if(this.upInfo.idUnit != undefined){
			this.font.draw(context,this.DescRect.buildDesc,this.pos.x+155, this.pos.y+64 );
				if(this.unit.icon != undefined) {
                    if(this.unit.hasRendered == undefined) {
                        this.unit.hasRendered = true;
                        this.unit.icon.pos.x = this.pos.x+150;
                        this.unit.icon.pos.y = this.pos.y+64;
                        this.unit.width = this.unit.icon.width*3;
                        this.unit.height = this.unit.icon.height*3;
                        me.game.add(this.unit.icon, 10000);
                        me.game.sort();
                    }
                }
		}else{
			this.font.draw(context,this.DescRect.buildDesc,this.pos.x+128, this.pos.y+64 );
			// BUILD UNIT BUTTON
			if( this.createUnitButton != undefined ) {
				context.fillStyle = "green";
				context.fillRect(this.createUnitButton.pos.x, this.createUnitButton.pos.y, this.createUnitButton.width, this.createUnitButton.height);
				this.font.draw(context,"TRAIN UNIT",this.createUnitButton.pos.x+1, this.createUnitButton.pos.y +5 );
			}
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
