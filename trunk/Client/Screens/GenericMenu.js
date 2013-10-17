jsApp.GenericMenu = me.Renderable.extend({
    "init" : function init(menuName, buttonList, title) {
        this.parent(new me.Vector2d(gameW/10, gameH/10), gameW-(gameW/10)*2, (gameH/10)*8);// position on the screen
        this.floating = true;
        this.title = title;
        this.menuName = menuName;
        this.isPersistent = true;
        this.fontSize = 14;
        this.font = new me.Font("verdana", this.fontSize, "lime", "left");
        this.titleFont = new me.Font("verdana", 18, "white", "left");
        // options that are displayed on the screen
        this.options = new Array();
        // THE MAIN MENU RECT
        this.menuRect = new me.Rect(
            new me.Vector2d(
                this.pos.x ,
                this.pos.y
            ),
            this.width,
            this.height
        );

        // CLOSE MENU BUTTON
        this.backRect = new me.Rect(
            new me.Vector2d(
                this.pos.x + 615,
                this.pos.y - 5
            ),
            30, 30
        );

        this.backRect.buttonColor = "red";
        this.backRect.buttonText = "X";
        this.backRect.type = "button";
        this.backRect.hasClickFunction = true;
        this.backRect.clickFunction = function(instance) {
            me.game.remove(instance,true);
            me.game.sort();
        };
        this.options.push(this.backRect);
        this.buttonList = buttonList;
        var ct = buttonList.length;
        var iniX = this.pos.x + 5;
        var iniY = this.pos.y + 50;
        while(ct--) {
            var button = buttonList[ct];
            button.pos.x += this.pos.x;
            button.pos.y += this.pos.y;
            if(button.Image != undefined) {
                button.icon = new me.AnimationSheet(
                    0, 0,
                    me.loader.getImage(button.Image),
                    button.imgW, button.imgH
                );
                button.icon.animationpause = true;
                button.icon.animationspeed = 0;
                button.icon.floating = true;
				if(button.animFrame == undefined){
					button.icon.addAnimation("anim", [0]);
					button.icon.setCurrentAnimation('anim');
				}else{
					button.icon.setAnimationFrame(button.animFrame);
				}
            }
            this.options.push(button);
            iniX += 70;
        }

        me.input.registerPointerEvent("mouseup", this,function(){
            // if i clicked the menu
            if(this.menuRect != undefined) {
                if (this.menuRect.containsPointV(me.input.changedTouches[0])) {
                    var ct = this.options.length;
                    while(ct--) {
                        if(this.options[ct].type=="button") {
                            if(this.options[ct].containsPointV(me.input.changedTouches[0])){
                                // if the option has no click function it must be a building !
                                if(this.options[ct].hasClickFunction == undefined) {
                                    me.game.remove(this);
                                    me.game.sort();
                                } else {
									
									console.log(this.options[ct].clickFunction(this));
                                    this.options[ct].clickFunction(this);
                                }
                            }
                        }
                    }
                    if(this.backRect.containsPointV(me.input.changedTouches[0])) {
                        me.game.remove(this);
                        me.game.sort();
                    }
                }
            }
        }.bind(this));


        me.input.registerPointerEvent("mousemove", this,function(){
            // if i clicked the menu
            if(this.menuRect != undefined) {

                var ct = this.options.length;
               // while(ct--){
               //     if(this.options[ct].containsPointV(me.input.changedTouches[0])) {
               //         //console.log(this.options[ct]);
               //     }
               // }
            }
        }.bind(this));

        this.open();

    },

    "open" : function() {
       me.game.add(this,1100);
       gameHandler.activeHuds[this.menuName] = "a";
       me.game.sort();
    },

    "destroy" : function destroy() {
        //Removing mouse events and huds
        me.input.releasePointerEvent("mousemove", this);
        me.input.releasePointerEvent("mousedown", this);
        me.input.releasePointerEvent("mouseup", this);

        // removing buttons
        var ct = this.options.length;
        while(ct--) {
            if(this.options[ct].icon!=undefined)
                me.game.remove(this.options[ct].icon);
        }
        // me.game.remove(this.houseRect.icon);
        gameHandler.activeHuds[this.menuName] = undefined;
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
                if(button.type=="button") {


                    context.globalAlpha = 0.6;
                    context.fillStyle = "black";
                    context.fillRect(button.pos.x, button.pos.y, button.width, button.height);


                } else {

                    context.globalAlpha = 1;
                    this.font.set("Verdana", button.size, button.color);
                    context.fillStyle = button.color;
                    this.font.size = button.size;
                    this.font.draw(
                        context,
                        button.text,
                        button.pos.x,
                        button.pos.y
                    );

                }

                // draw TILE if specified

                if(button.icon != undefined) {
                    if(button.hasRendered == undefined) {
                        button.hasRendered = true;
                        button.icon.pos.x = button.pos.x + 3;
                        button.icon.pos.y = button.pos.y + 3;
                        //button.width = button.icon.width*3;
                        //button.height = button.icon.height*3;
                        me.game.add(button.icon, 10000);
                        me.game.sort();
                    }
                }

                if(button.buttonText != undefined) {
                    context.globalAlpha = alpha;

                    this.font.draw(
                        context,
                        button.buttonText,
                        button.pos.x + 5,
                        button.pos.y + 5
                    );
                    context.globalAlpha = 0.6;
                }


            }
            context.fillStyle = "#00066";
            context.globalAlpha = alpha;
            this.titleFont.draw(
                context,
                this.title,
                gameW/3,
                gameH/8
            );
        }


        context.globalAlpha = alpha;
        context.fillStyle = fillStyle;

    }
});