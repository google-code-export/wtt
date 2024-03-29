jsApp.WorldBuildingOptions = me.Renderable.extend({
    "init" : function init(type,idVillage,villageOwner,pixelIs,x,y,isTemple) {
	
        this.floating = false;
        this.isPersistent = false;
		this.alwaysUpdate = true;

		this.isTemple		= isTemple;
		this.idVillage	    = idVillage;
		this.villageOwner	= villageOwner;
		this.x				= x;
		this.y				= y;
		var pX 				= pixelIs.x;
		var pY 				= pixelIs.y;
		console.log(pX);
		console.log(pY);
		//VERIFYING IF IT'S THE END OF THE MAP!
		if(pX >= 1216){
			var pXx = pX - 100;
		}else{
			var pXx = pX + 65;
		}
		
		if(pY >= 1216){
			var mathRule = "-";
		}else{
			var mathRule = "+";
		}
		///////////////////////////////////
		
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
					pXx,
					pY
				 ),
				 100, 50
			);
			if(mathRule == '+'){iY += 50;}else{ iY -= 50;}
			
			this.enterRect.buttonText = "Enter";
			this.options.push(this.enterRect);//including button to the array
		}else{
			//IF THIS IS THE TEMPLE
			if(this.isTemple == 'Y'){
				//////////////////////
				// ATTACK
				this.attackTempleRect = new me.Rect(
					new me.Vector2d(
						pXx,
						pY+iY
					 ),
					 110, 50
				);
				if(mathRule == '+'){iY += 50;}else{ iY -= 50;}
				
				this.attackTempleRect.buttonText = "Attack Temple";
				this.options.push(this.attackTempleRect);//including button to the array
			//IF IT'S A QUEST
			}else if(this.villageOwner == null){
				//////////////////////
				// EXPLORE
				this.exploreRect = new me.Rect(
					new me.Vector2d(
						pXx,
						pY+iY
					 ),
					 100, 50
				);
				if(mathRule == '+'){iY += 50;}else{ iY -= 50;}
				
				this.exploreRect.buttonText = "Explore...";
				this.options.push(this.exploreRect);//including button to the array	
			//IF IT'S A USER VILLAGE
			}else{
				//////////////////////
				// ATTACK
				this.attackRect = new me.Rect(
					new me.Vector2d(
						pXx,
						pY+iY
					 ),
					 100, 50
				);
				if(mathRule == '+'){iY += 50;}else{ iY -= 50;}
				
				this.attackRect.buttonText = "Attack";
				this.options.push(this.attackRect);//including button to the array
				
				//////////////////////
				// TRADE
				this.tradeRect = new me.Rect(
					new me.Vector2d(
						pXx,
						pY+iY
					 ),
					 100, 50
				);
				if(mathRule == '+'){iY += 50;}else{ iY -= 50;}
				
				this.tradeRect.buttonText = "Trade";
				this.options.push(this.tradeRect);//including button to the array
				//////////////////////
				// SEND MSG
				this.msgRect = new me.Rect(
					new me.Vector2d(
						pXx,
						pY+iY
					 ),
					 100, 50
				);
				this.msgRect.buttonText = "Send Msg";
				this.options.push(this.msgRect);//including button to the array
			}
		}

			
			var totalHeight = iY+5;
			var ct = this.options.length;

			while(ct--){
				console.log(this.options[ct]);
			}
			
			this.font = new me.Font("verdana", 14, "lime", "right");
			this.font.textBaseline = "bottom";
			
			this.parent(new me.Vector2d(pX,pY), 110, iY);
			gameHandler.activeHuds.actionWorldMenu = this;
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