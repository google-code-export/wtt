jsApp.ActionMenu = me.Renderable.extend({
	//Aqui na verdade inicia o role
    "init" : function init(type, villageName) {
        this.parent(new me.Vector2d(0, gameH-40), gameW, 40);
        this.floating     = true;
        this.isPersistent = false;
		this.mouseAction  = undefined;
		this.villageName  = villageName;
		
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
		var iX = 5;
		if(type == "Village"){
			//////////////////////
			// POSSIBLE BUTTONS //
			//////////////////////
			// BUILD
			// Me.Rect(x,y,Witdh,Height)
			this.buildRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				 ),
				 50, 30
			);
			iX+=55;
			/////////////////////
			// VIEW UNITS
			/*this.unitsRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				50, 30
			);
			iX+=55;*/
			///////////////////////
			//CREATE SQUAD
			this.squadRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +5+iX,
					this.pos.y+5
				),
				100, 30
			);
			iX+=110;
			///////////////////////
			// VIEW SQUAD
			this.viewSquadRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				100, 30
			);
			iX+=110;
			///////////////////////
			// CHANGE SQUAD
			this.changeSquadRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				110, 30
			);
			iX+=120;
			///////////////////////
			// TRANSFER SQUAD
			this.transferSquadRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				115, 30
			);
			iX+=125;
			///////////////////////
			//MARKET
			/*this.sellRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				50, 30
			);
			iX+=55;
			this.buyRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				50, 30
			);
			iX+=55;*/
			//////////////////
			//OUTWORLD
			this.worldRect = new me.Rect(
				new me.Vector2d(
					this.pos.x +iX,
					this.pos.y+5
				),
				50, 30
			);
			
			this.squadRect.buttonText         = "Create Squad";
			this.viewSquadRect.buttonText     = "View Squad";
			this.changeSquadRect.buttonText   = "Change Squad";
			this.transferSquadRect.buttonText = "Transfer Squad";
			this.buildRect.buttonText  	      = "Build";
			this.worldRect.buttonText         = "World";
			
			this.mainOptions.push(this.buildRect);//incluindo os botões no vetor
			//this.mainOptions.push(this.unitsRect);//incluindo os botões no vetor
			this.mainOptions.push(this.squadRect);//incluindo os botões no vetor
			this.mainOptions.push(this.viewSquadRect);//incluindo os botões no vetor
			this.mainOptions.push(this.changeSquadRect);//incluindo os botões no vetor
			this.mainOptions.push(this.transferSquadRect);//incluindo os botões no vetor
			//this.mainOptions.push(this.buyRect);//incluindo os botões no vetor
			//this.mainOptions.push(this.sellRect);//incluindo os botões no vetor
			this.mainOptions.push(this.worldRect);//incluindo os botões no vetor
			this.options = this.mainOptions;
		}
		
		if(type == "World"){
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
			this.mainOptions.push(this.buildRect);//incluindo os botões no vetor
			this.options = this.mainOptions;
		}
		
		this.background 				  = me.loader.getImage("WoodTexture");
		this.font 						  = new me.Font("verdana", 14, "lime", "right");
		this.font.textBaseline            = "bottom";
		this.villageFont                  = new me.Font("verdana", 20, "white", "right");
		this.villageFont.textBaseline     = "bottom";
		gameHandler.activeHuds.actionMenu = this;
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
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		context.drawImage(this.background, 0, gameH-40, gameW, 40);
		
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
		
		this.villageFont.draw(context, this.villageName, gameW - 35, gameH - 10);		

        context.globalAlpha = alpha;


    }
});