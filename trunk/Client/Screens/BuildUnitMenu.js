jsApp.BuildUnitMenu = me.Renderable.extend({
    "init" : function init(unitList, buildingIsMaking) {
        this.building = buildingIsMaking;
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
        this.menuRect = new me.Rect(
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

        this.buttonList = unitList;
        var ct = unitList.length;
        var iniX = this.pos.x + 5;
        var iniY = this.pos.y + 50;
        while(ct--) {
            var infoUnit = unitList[ct];
            var button = new me.Rect(
                new me.Vector2d(
                    iniX,
                    iniY
                ),
                120, 200
            );
            button.icon = new me.AnimationSheet(
                0, 0,
                me.loader.getImage(infoUnit.Image),
                14, 18
            );
            button.icon.floating = true;
            // FALTA ALGUMA COISA AQUI
            //button.icon.animationpause = true;
            //button.icon.animationspeed = 5;
            button.icon.addAnimation("anim", [0]);
            button.icon.setCurrentAnimation('anim');
            button.icon.resize(3);
            button.info = infoUnit;
            button.icon.setAnimationFrame(0);
            this.options.push(button);
            iniX += 70;
        }

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
        this.backRect.hasClickFunction = true;
        this.backRect.clickFunction = function(instance) {
             me.game.remove(instance,true);
             me.game.sort();
        };
        this.options.push(this.backRect);
		
		
        this.font = new me.Font("verdana", 14, "lime", "right");
        this.titleFont = new me.Font("verdana", 18, "white", "right");
        this.font.textBaseline = "bottom";


        me.input.registerPointerEvent("mouseup", this,function(){
            // if i clicked the menu

            if(this.menuRect != undefined) {
                if (this.menuRect.containsPointV(me.input.changedTouches[0])) {
                    var ct = this.options.length;
                    while(ct--) {
                        if(this.options[ct].containsPointV(me.input.changedTouches[0])){
                            // if the option has no click function it must be a building !
                            if(this.options[ct].hasClickFunction == undefined) {
								//*me.game.add(new jsApp.BuildingDetail(),5000);
								//me.game.sort();
                                //simply make the selector to build it
                                //// THIS PART WILL BE ON A TIMER when recives confirmation of the onRequestUnit
								
                                var data = {
                                    idBuildingBuilt  : this.building.idBuildingBuilt,
									buildingX		 : this.building.posX,
									buildingY		 : this.building.posY,
                                    idUnit 			 : this.options[ct].info.idUnit,
									unitImg          : this.options[ct].info.Image,
                                    userId 			 : jsApp.getUserData().userId,
									idVillage		 : jsApp.getUserData().idVillage
                                }
                                var socket = jsApp.getSocket();
                                socket.emit("onRequestUnit", data);
                            } else {
                                this.options[ct].clickFunction(this);
                            }
                        }
                    }
                }
            }
		}.bind(this));


        me.input.registerPointerEvent("mousemove", this,function(){
            // if i clicked the menu
            if(this.menuRect != undefined) {

                var ct = this.options.length;
                while(ct--){
                    if(this.options[ct].containsPointV(me.input.changedTouches[0])) {
						//console.log(this.options[ct]);
                    }
                }
            }
        }.bind(this));

    },

    "destroy" : function destroy() {
        //Removing mouse events and huds
        me.input.releasePointerEvent("mousemove", this);
        me.input.releasePointerEvent("mousedown", this);
		me.input.releasePointerEvent("mouseup", this);

        // removing buttons
        var ct = this.options.length;
        while(ct--) {
            me.game.remove(this.options[ct].icon);
        }
       // me.game.remove(this.houseRect.icon);
        gameHandler.activeHuds.unitMenu = undefined;
    },

    "update" : function update() {
        return this.visible;
    },
	
    "draw" : function(context) {
        //All this content it's only for drawing
        //size,colors,positions
        // Transparent background
        var alpha = context.globalAlpha;
		var fillStyle = context.fillStyle;
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
                        button.icon.pos.x = button.pos.x+12;
                        button.icon.pos.y = button.pos.y+15;
                        button.width = button.icon.width*3;
                        button.height = button.icon.height*3;
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
                "Unit Menu",
                gameW/3,
                gameH/8
            );
        }


        context.globalAlpha = alpha;
		context.fillStyle = fillStyle;

    }
});