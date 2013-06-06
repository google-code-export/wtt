//Npc Entity
var Unit = me.ObjectEntity.extend(
    {
        init:function (x, y, settings)
        {
            this.parent(x, y , settings);

            // adding animations/ 
			
            this.renderable.addAnimation("stand-up", [6]);
            this.renderable.addAnimation("down", [1,0,2,0]);
            this.renderable.addAnimation("left", [4,3,5,3]);
            this.renderable.addAnimation("up", [7,6,8,6]);
            this.renderable.setCurrentAnimation('left');
			
        },
        // Update player position.
        update : function ()
        {
            this.pos.x +=0.3;
            this.renderable.animationspeed = me.sys.fps / 10;
            this.parent();
        }
    });