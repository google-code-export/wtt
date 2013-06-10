jsApp.ActionMenu = me.Renderable.extend({
	//Aqui na verdade inicia o role
    "init" : function init() {
        this.parent(new me.Vector2d(0, gameH-40), gameW, 40);
        this.floating = true;
        this.isPersistent = true;
		this.mouseAction = undefined;
        // options that are displayed on the screen
        this.options = new Array();

        // main menu options
        this.mainOptions = new Array();
        ///////////////////////////
        // Declaring All Options //
        ///////////////////////////
		// Me.Rect(x,y,Witdh,Height)
        this.menuRect = new me.Rect(
            new me.Vector2d(
                this.pos.x + 0,
                this.pos.y + 10
            ),
            gameW,
            40
        );

        //////////////////////
        // POSSIBLE BUTTONS //
        //////////////////////
        // BUILD
		// Me.Rect(x,y,Witdh,Height)
        this.buildRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +5,
                this.pos.y+5
             ),
             50, 30
        );
        this.buildRect.buttonText = "Build";

        // BACK
		// Me.Rect(x,y,Witdh,Height)
        this.backRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +5,
                this.pos.y+5
            ),
            50, 30
        );
        this.backRect.buttonText = "House";

        // HOUSE
		// Me.Rect(x,y,Witdh,Height)
        this.houseRect = new me.Rect(
            new me.Vector2d(
                this.pos.x +5,
                this.pos.y+5
            ),
            50, 30
        );
        this.houseRect.buttonText = "House";

        jsApp.getSocket().on("onListBuilding", function(data) {
            this.buildMenu = new jsApp.BuildMenu(data[0]);
            gameHandler.activeHuds.buildMenu = this;
            me.game.add(this.buildMenu,1000);
            me.game.sort();
        });

        this.mainOptions.push(this.buildRect);//incluindo os botões no vetor
        this.options = this.mainOptions;
        this.font = new me.Font("verdana", 14, "lime", "right");
        this.font.textBaseline = "bottom";

        this.mouseDown = function() {
            // if i clicked the menu
            if(this.menuRect != undefined) {
                if (this.menuRect.containsPoint(me.input.touches[0])) {
                    // if i clicked the "BUILD" button
                    if(this.buildRect.containsPoint(me.input.touches[0])) {
                        ///////// PUT THE HUD INTO THE SCREEN
                        // game.add(object, z)
                        if(gameHandler.activeHuds.buildMenu!=undefined)
                            return;
                        jsApp.send("onListBuilding", jsApp.getUserData());
                        //if(gameHandler.activeHuds.buildMenu!=undefined)
                        //    return;
                        //this.buildMenu = new jsApp.BuildMenu();
                        //gameHandler.activeHuds.buildMenu = this;
                        //me.game.add(this.buildMenu,1000);
                        //me.game.sort();
                    }
                }
            }
        }.bind(this);



        me.input.registerMouseEvent("mouseup", this,function(){
            me.event.publish("clickMenu");
		}.bind(this));

        me.event.subscribe("clickMenu", this.mouseDown);

    },

    "destroy" : function destroy() {
        me.input.releaseMouseEvent("mousemove", this);
        me.input.releaseMouseEvent("mouseup", this);
		me.input.releaseMouseEvent("mousedown", this);
    },

    "update" : function update() {
        return this.visible;
    },
	
    "draw" : function(context) {
        // Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.6;
        context.fillStyle = "#000";
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        if(this.options!=undefined) {
            var ct = this.options.length;
            while(ct--) {
                var button = this.options[ct];
                context.fillRect(button.pos.x, button.pos.y, button.width, button.height);
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
        }


        context.globalAlpha = alpha;


    }
});