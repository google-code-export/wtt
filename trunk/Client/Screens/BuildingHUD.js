jsApp.BuildingHUD = me.Renderable.extend({
    "init" : function init(infoBuild) {
        var socket  = jsApp.getSocket();
        this.upInfo = infoBuild ;
        this.upInfo.idVillage	= 1; //---> Need to see this better
		this.mouseAction = undefined;
		this.parent(new me.Vector2d(0,gameH-128));
        this.floating = true;
        this.isPersistent = true;

        this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
        this.Stoneimage = me.loader.getImage("Stone");
        this.Ironimage  = me.loader.getImage("Iron") ;
        this.Meatimage  = me.loader.getImage("Meat") ;
        this.Coinimage  = me.loader.getImage("Coin") ;
		this.Buildimage = me.loader.getImage("BuildImg");
        gameHandler.activeHuds.buildingHUD = this;

        this.rectangle = new me.Rect(
            new me.Vector2d(
                0,
                gameH-128
            )
            ,gameW,128
        )

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
        if(this.upInfo.Timer != undefined){
            titletext = infoBuild.Description;
            this.DescRect.TitleText = titletext.toUpperCase();
            console.log(infoBuild.Timer);
            this.TimerRect.countDown = jsApp.timeToMs(infoBuild.Timer);
            this.TimerRect.initTime = me.timer.getTime();
        }else{
            if(this.upInfo.Msg == undefined){
                titletext = infoBuild.basicDescription;
                this.DescRect.TitleText = titletext.toUpperCase();
            } else {
                titletext = infoBuild.Description;
                this.DescRect.TitleText = titletext.toUpperCase();
            }
        }

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
		context.globalAlpha = 0.9;
        context.fillStyle = "#00066";

        //BUILDING RECTS//
        context.fillRect(0,gameH-128,gameW, 128);
        context.globalAlpha = 1;

		context.drawImage(this.Buildimage, this.pos.x, this.pos.y);
        //

       //DESCRIPTION RECT//
        this.font.draw(context,this.DescRect.TitleText,this.pos.x+128, this.pos.y );
        this.font.draw(context,this.DescRect.buildDesc,this.pos.x+128, this.pos.y+64 );
        //

        //UPDATE RECT//
        this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
        if(this.upInfo.Timer != undefined){
            this.font.draw(context,this.UPRect.TitleText,this.pos.x+((gameW/3)*2), this.pos.y );
            this.font.draw(context,this.upInfo.Timer,this.pos.x+((gameW/3)*2), this.pos.y+64 );
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

                context.fillStyle = "#585858";
                context.fillRect(this.buildRect.pos.x, this.buildRect.pos.y, this.buildRect.width, this.buildRect.height);
                this.buttonfont.draw(context, this.buildRect.buttonText, this.buildRect.pos.x + this.buildRect.width - 8, this.buildRect.pos.y + this.buildRect.height - 8);
            }

        }

    },

    "destroy" : function() {
        gameHandler.activeHuds.buildingHUD = undefined;
		me.input.releasePointerEvent("mousedown", this);
		me.input.releasePointerEvent("mouseup", this);
		me.input.releasePointerEvent("mousemove", this);
        this.upInfo     = undefined;
        this.Woodimage  = undefined;
        this.Stoneimage = undefined;
        this.Ironimage  = undefined;
        this.Meatimage  = undefined;
        this.Coinimage  = undefined;
        this.Buildimage = undefined;
        // o certo eh guardar as img dinamicamente em algum lugar e só ir buscando elas
    },
    "update" : function() {
        //alert("wolololo");
        //if(this.TimerRect.timeInit != undefined){
            var total = this.TimerRect.countDown;
            var progressTime = me.timer.getTime() - this.TimerRect.timeInit;
            if(progressTime > this.TimerRect.countDown){
                this.upInfo.Timer = jsApp.msToTime(total - progressTime);
                console.log(this.upInfo.Timer);
            }else{
                me.game.remove(this,true);
            }
        //}
        return true;
    }
});
