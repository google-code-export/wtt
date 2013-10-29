//Npc Entity
var Unit = me.ObjectEntity.extend(
    {
        init:function (x, y, settings,classType)
        {
            settings.name = classType;
            settings.image = classType;
            settings.spritewidth = 20;
            settings.spriteheight = 24;
			this.isPersistent = false;
            this.parent(x, y , settings);

            this.lastAction = undefined;
            this.willMoveTo = true;
            this.movingTo = undefined;
            this.accel.x = 0.6;
            this.accel.y = 0.6;
            this.dir = "stand-up";
            this.renderable.addAnimation("stand-up", [0]);
            this.renderable.addAnimation("down", [1,1,0,0,2,2,0,0]);
            this.renderable.addAnimation("left", [4,4,3,3,5,5,3,3]);
            this.renderable.addAnimation("up", [7,7,6,6,8,8,6,6]);
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