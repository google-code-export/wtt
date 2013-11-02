//Npc Entity
var Unit = me.ObjectEntity.extend(
    {
        init:function (x, y, settings)
        {
			
			var classType = settings.Description;
			var image	  = classType.replace(" ","_");
			//VERIFYING IF THE UNIT IT'S A MOUNT
			var isMount = settings.Description.indexOf('Mount'); 
			//if not
			if( isMount == -1){
				var imgConf 		  = "_24x20";
				settings.spritewidth  = 20;
				settings.spriteheight = 24;
				settings.name 		  = classType;
				settings.image 		  = image+imgConf;
			}else{
				var imgConf 		  = "_39x37";
				settings.spritewidth  = 37.5;
				settings.spriteheight = 39;	
				settings.name         = classType;
				settings.image 		  = image+imgConf;
			}
			//
			console.log(settings);
			this.isPersistent = false;
            this.parent(x, y , settings);

            this.lastAction = undefined;
            this.willMoveTo = true;
            this.movingTo = undefined;
            this.accel.x = 0.6;
            this.accel.y = 0.6;
            this.dir = "stand-up";
            this.renderable.addAnimation("stand-up", [0]);
            this.renderable.addAnimation("down", [1,1,0,2,2,0]);
            this.renderable.addAnimation("left", [4,4,3,5,5,3]);
            this.renderable.addAnimation("up", [7,7,6,8,8,6]);
            this.renderable.setCurrentAnimation('stand-up');
			
        },
        // Update player position.
        update : function ()
        {
            UnityAI.takeMyMindAway(this); // woooooooorray
            //this.pos.x +=0.3;
            this.parent();
        },
		
		destroy : function ()
		{
			me.game.remove(this);
		}
    });