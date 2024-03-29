jsApp.VillageUnitsGeneral = me.Renderable.extend({
    "init" : function init(listUnits, listClasses) {
        this.parent(new me.Vector2d(gameW/10, gameH/10), gameW-(gameW/10)*2, (gameH/10)*8);// position on the screen
        this.floating = true;
        this.listUnits = listUnits;
        this.listClasses = listClasses;
        this.isPersistent = false;
        this.font = new me.Font("verdana", 14, "lime", "left");
        this.titleFont = new me.Font("verdana", 18, "white", "left");
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


        // Me.Rect(x,y,Witdh,Height)
        this.backRect = new me.Rect(
            new me.Vector2d(
                this.pos.x + 615,
                this.pos.y - 5
            ),
            30, 30
        );

        // construindo as imagem
        this.classImages = {

        };
        this.imgList = new Array();
        this.rectList = new Array();
        var ct = this.listClasses.length;
        var iX = this.pos.x + 45;
        var iY = this.pos.y + 45;
        while(ct--) {
            var thisClass = this.listClasses[ct];
            // soh adiciona a img se ja n tiver
            if(this.classImages["id_"+thisClass.idUnit] == undefined) {
                var img = new me.AnimationSheet(
                    0, 0,
                    me.loader.getImage(thisClass.Image),
                    14, 18
                );
                //context.fillRect(iX, iY, 120, 20);
                img.floating = true;
                // FALTA ALGUMA COISA AQUI
                //button.icon.animationpause = true;
                //button.icon.animationspeed = 5;
                img.addAnimation("anim", [0]);
                img.setCurrentAnimation('anim');
                img.resize(2);
                img.setAnimationFrame(0);
                this.classImages["id_"+thisClass.idUnit] = img;
                this.imgList.push(img);
            }
            var rect = new me.Rect(
                new me.Vector2d(
                    0,
                    0
                ),
                120, 20
            );
            rect.clickFunction = function(instance, idClass, className) {
                me.game.remove(instance,true);
                me.game.sort();
                jsApp.ListUnitInClass(instance.listUnits, this.idClass, className);
            };
            rect.idClass = thisClass.idUnit;
            thisClass.rect = rect;

        }



        this.backRect.buttonColor = "red";
        this.backRect.buttonText = "X";
        this.backRect.hasClickFunction = true;

        //////////////////////
        // POSSIBLE BUTTONS //
        //////////////////////
        // BUILD
		// Me.Rect(x,y,Witdh,Height)

        me.input.registerPointerEvent("mouseup", this,function(){
            // if i clicked the menu
            if (this.menuRect.containsPointV(me.input.changedTouches[0])) {
                if (this.backRect.containsPointV(me.input.changedTouches[0])) {
                    me.game.remove(this,true);
                    me.game.sort();
                }
                var ct = this.listClasses.length;
                while(ct--) {
                    if(this.listClasses[ct].rect.containsPointV(me.input.changedTouches[0])) {

                        this.listClasses[ct].rect.clickFunction(this,this.listClasses[ct].idClass, this.listClasses[ct].Description);
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
        var ct = this.imgList.length;
        while(ct--) {
            me.game.remove(this.imgList[ct]);
        }
        me.game.sort();
        this.classImages = undefined;
        gameHandler.activeHuds.villageUnitsGeneral = undefined;
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
        context.fillRect(this.backRect.pos.x, this.backRect.pos.y, this.backRect.width, this.backRect.height);
        this.titleFont.draw(
            context,
            "X",
            this.backRect.pos.x+10,
            this.backRect.pos.y+9
        );

        context.fillStyle = "#00066";
        context.globalAlpha = alpha;
        this.titleFont.draw(
            context,
            "Village Units",
            gameW/3,
            gameH/8
        );
        context.fillStyle = fillStyle;
        var ct = this.listClasses.length;
        var iX = this.pos.x + 45;
        var iY = this.pos.y + 45;
        while(ct--) {
            var thisClass = this.listClasses[ct];

            var rect = thisClass.rect;
            rect.pos.x = iX;
            rect.pos.y = iY;
            context.fillStyle = "#00066";
            context.globalAlpha = 0.6;
            context.fillRect(rect.pos.x, rect.pos.y, rect.width, rect.height);
            context.globalAlpha = 1;
            if( this.classImages["id_"+thisClass.idUnit]!=undefined) {
                var img = this.classImages["id_"+thisClass.idUnit];
                img.pos.x = iX;
                img.pos.y = iY;
                me.game.add(img, 10000);
                me.game.sort();
                this.classImages["id_"+thisClass.idUnit] = undefined;
            }

            this.font.draw(
                context,
                thisClass.Description,
                iX+21,
                iY+3
            );
            this.font.draw(
                context,
                thisClass.qty+" x ",
                iX-30,
                iY+3
            );
            context.fillStyle = fillStyle;

            iY += 25;
        }
        // context.globalAlpha = alpha;
		// context.fillStyle = fillStyle;

    }
});