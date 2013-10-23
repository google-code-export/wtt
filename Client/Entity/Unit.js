//Npc Entity
var Unit = me.ObjectEntity.extend(
    {
        init:function (x, y, settings,classType)
        {
            settings.name = classType;
            settings.image = classType;
            settings.spritewidth = 14;
            settings.spriteheight = 18;
			this.isPersistent = false;
            this.parent(x, y , settings);

            this.lastAction = undefined;
            this.willMoveTo = true;
            this.movingTo = undefined;
            this.accel.x = 0.4;
            this.accel.y = 0.4;
            this.dir = "stand-up";
            this.renderable.addAnimation("stand-up", [6]);
            this.renderable.addAnimation("down", [1,0,2,0]);
            this.renderable.addAnimation("left", [4,3,5,3]);
            this.renderable.addAnimation("up", [7,6,8,6]);
            this.renderable.setCurrentAnimation('left');
			
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