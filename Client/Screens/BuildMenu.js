jsApp.BuildMenu = me.Renderable.extend({
    "init" : function init(buildList) {
        this.parent(new me.Vector2d(gameW/10, gameH/10), gameW-(gameW/10)*2, (gameH/10)*8);// position on the screen
        this.floating = true;
        this.isPersistent = true;
		this.mouseAction = undefined;//binding variable for mouse actions
        // options that are displayed on the screen
        this.options = new Array();

        // main menu options
        this.mainOptions = new Array();
        ///////////////////////////
        // Declaring All Options //
        ///////////////////////////
		// Me.Rect(x,y,Witdh,Height)
        //Creating the HUD
        this.buildMenuRect = new me.Rect(
            new me.Vector2d(
                this.pos.x ,
                this.pos.y
            ),
            this.width,
            this.height
        );

        //////////////////////
        // POSSIBLE BUTTONS //
        //////////////////////
        // BUILD
		// Me.Rect(x,y,Witdh,Height)

        var ct = buildList.length;
        var iniX = this.pos.x + 5;
        var iniY = this.pos.y + 50;
        while(ct--) {
            var canBuild = buildList[ct];
            var button = new me.Rect(
                new me.Vector2d(
                    iniX,
                    iniY
                ),
                60, 30
            );
            button.icon = new me.AnimationSheet(
                0, 0,
                me.loader.getImage("TileSet"),
                64, 64
            );
            button.icon.floating = true;
            // FALTA ALGUMA COISA AQUI
            button.icon.animationpause = true;
            button.icon.animationspeed = 0;
            button.info = canBuild;
            console.log(canBuild.idTile);
            console.log(canBuild.wood);
            button.icon.setAnimationFrame(canBuild.idTile);
            this.options.push(button);
            iniX += 70;
        }

        /*
        this.houseRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +5,
                this.pos.y+50
             ),
             60, 30
        );
        //this.houseRect.buttonText = "House";
        //adding the image property
        this.houseRect.icon = new me.AnimationSheet(
            0, 0,
            me.loader.getImage("TileSet"),
            64, 64
        );
        this.houseRect.icon.floating = true;
        // FALTA ALGUMA COISA AQUI
        this.houseRect.icon.animationpause = true;
        this.houseRect.icon.animationspeed = 0;
        this.houseRect.icon.setAnimationFrame(0);
        */

        // BACK
		// Me.Rect(x,y,Witdh,Height)
        this.backRect = new me.Rect(
            new me.Vector2d(
                this.pos.x + 615,
                this.pos.y - 5
            ),
            30, 30
        );
        this.backRect.buttonColor = "red";
        this.backRect.buttonText = "X";


        //this.mainOptions.push(this.backRect);//including buttons on the array
        this.options.push(this.backRect);
        //this.options = this.mainOptions;
        this.font = new me.Font("verdana", 14, "lime", "right");
        this.titleFont = new me.Font("verdana", 18, "white", "right");
        this.font.textBaseline = "bottom";


        me.input.registerMouseEvent("mouseup", this,function(){
            // if i clicked the menu
            if(this.buildMenuRect != undefined) {
                if (this.buildMenuRect.containsPoint(me.input.touches[0])) {
                    // if i clicked the "BUILD" button
                    /*
                    if(this.houseRect.containsPoint(me.input.touches[0])) {
                        //Verifying if the player have enough resources to build
                        var PlayerCoin  =  gameHandler.activeHuds["resourceHud"].GoldValue;
                        var PlayerWood  =  gameHandler.activeHuds["resourceHud"].WoodValue;
                        var PlayerStone =  gameHandler.activeHuds["resourceHud"].StoneValue;

                        if( (PlayerCoin<200) || (PlayerWood<50) || (PlayerStone<50)){
                            alert("You Dont Have Enough Resources!");
                        }else{
                            ///////// PUT THE HUD INTO THE SCREEN
                            this.building = new jsApp.BuildArea();// creating a new instance of the class BuildArea
                            me.game.add(this.building,1000);// adding this to the screen
                            gameHandler.activeHuds.buildingArea = this.building;
                            me.game.remove(this); //removing the build hud
                            me.game.sort(); // "printing" all this into the screen
                        }
                    }
                    */
                    if(this.backRect.containsPoint(me.input.touches[0])) {
                        ///////// PUT THE HUD INTO THE SCREEN
                        // game.add(object, z) --> Z it's to defines who is in front of who. Bigger values means top positions
                        me.game.remove(this,true);
                        me.game.sort();
                    }
                }
            }
		}.bind(this));

        me.input.registerMouseEvent("mousemove", this,function(){
            // if i clicked the menu
            if(this.buildMenuRect != undefined) {

                var ct = this.options.length;
                while(ct--){
                    if(this.options[ct].containsPoint(me.input.touches[0])) {

                        //alert(this.options[ct].info.Descricao);
                    }
                }
            }
        }.bind(this));
    },

    "destroy" : function destroy() {
        //Removing mouse events and huds
        me.input.releaseMouseEvent("mousemove", this);
        me.input.releaseMouseEvent("mousedown", this);
		me.input.releaseMouseEvent("mouseup", this);

        // removing buttons
        var ct = this.options.length;
        while(ct--) {
            me.game.remove(this.options[ct].icon);
        }
       // me.game.remove(this.houseRect.icon);
        gameHandler.activeHuds.buildMenu = undefined;
    },

    "update" : function update() {
        return this.visible;
    },
	
    "draw" : function(context) {
        //All this content it's only for drawing
        //size,colors,positions
        // Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.6;
        context.fillStyle = "#00066";

        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        if(this.options!=undefined) {
            var ct = this.options.length;
            while(ct--) {
                var button = this.options[ct];
                context.fillRect(button.pos.x, button.pos.y, button.width, button.height);
                // draw TILE if specified

                if(button.icon != undefined) {
                    if(button.hasRendered == undefined) {
                        button.hasRendered = true;
                        button.icon.pos.x = button.pos.x;
                        button.icon.pos.y = button.pos.y;
                        button.width = button.icon.width;
                        button.height = button.icon.height;
                        me.game.add(button.icon, 10000);
                        me.game.sort();
                    }
                }

                if(button.buttonText != undefined) {
                    context.globalAlpha = alpha;
                    this.font.draw(
                        context,
                        button.buttonText,
                        button.pos.x + button.width - 8,
                        button.pos.y + button.height - 8
                    );
                    context.globalAlpha = 0.6;
                }
            }
            context.fillStyle = "#00066";
            context.globalAlpha = alpha;
            this.titleFont.draw(
                context,
                "Building Menu",
                gameW/3,
                gameH/8
            );
        }


        context.globalAlpha = alpha;


    }
});