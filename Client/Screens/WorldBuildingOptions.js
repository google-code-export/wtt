jsApp.WorldBuildingOptions = me.Renderable.extend({
    "init" : function init(type,idVillage,villageOwner,pixelIs) {
	
        this.floating = false;
        this.isPersistent = false;
		this.alwaysUpdate = true;

		gameHandler.activeHuds.actionWorldMenu = this;
		this.idVillage						   = idVillage;
		this.villageOwner				       = villageOwner;
		var pX = pixelIs.x;
		var pY = pixelIs.y;
        // options that are displayed on the screen
        this.options = new Array();
		var iY = 0;
        ///////////////////////////
        // Declaring All Options //
        ///////////////////////////

			//////////////////////
			// POSSIBLE BUTTONS //
			//////////////////////
		
		if(type == "Friend"){
			//////////////////////
			// ENTER
			this.enterRect = new me.Rect(
				new me.Vector2d(
					pX +65,
					pY
				 ),
				 100, 50
			);
			iY += 50;
			this.enterRect.buttonText = "Enter";
			this.options.push(this.enterRect);//including button to the array
		}else{
			//////////////////////
			// ATTACK
			this.attackRect = new me.Rect(
				new me.Vector2d(
					pX +65,
					pY+iY
				 ),
				 100, 50
			);
			iY += 50;
			this.attackRect.buttonText = "Attack";
			this.options.push(this.attackRect);//including button to the array
			
			//////////////////////
			// TRADE
			this.tradeRect = new me.Rect(
				new me.Vector2d(
					pX +65,
					pY+iY
				 ),
				 100, 50
			);
			iY += 50;
			this.tradeRect.buttonText = "Trade";
			this.options.push(this.tradeRect);//including button to the array
			//////////////////////
			// SEND MSG
			this.msgRect = new me.Rect(
				new me.Vector2d(
					pX +65,
					pY+iY
				 ),
				 100, 50
			);
			this.msgRect.buttonText = "Send Msg";
			this.options.push(this.msgRect);//including button to the array
		}

			
			var totalHeight = iY+5;
			
			var ct = this.options.length;

			while(ct--){
				console.log(this.options[ct]);
			}
			
			this.font = new me.Font("verdana", 14, "lime", "right");
			this.font.textBaseline = "bottom";
			
			this.parent(new me.Vector2d(pX,pY), 110, iY);
    },

    "destroy" : function destroy() {
		me.game.remove(this);
    },

    "update" : function update() {
        return this.visible;
    },
	
    "draw" : function(context) {
        // Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.6;
        context.fillStyle = "#000";
        context.fillRect(this.pos.x, this.pos.y, 64, 64);

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
                    context.fillStyle = "#000";
                }
            }
        }


        context.globalAlpha = alpha;


    }
});