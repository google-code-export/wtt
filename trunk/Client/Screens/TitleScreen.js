// Title Screen
var TitleScreen = me.ScreenObject.extend(
    {
        init: function()
        {
            this.parent(true);
            this.title = null;
          //  this.font = null;
          //  this.scrollerfont = null;
            this.scrollertween = null;
            this.scrollerpos = 1;
        },

        onResetEvent: function()
        {

            if (this.title == null)
            {
                this.title = me.loader.getImage("Title");
                //this.title.resize(2);
              //  this.font = new me.BitmapFont("BaseFont", 16);
               // this.font.set("left");
                //this.scrollerfont = new me.BitmapFont("BaseFont", 16);
                //this.scrollerfont.set("left");
            }
          //  this.scrollerpos = 640;
            //this.scrollertween = new me.Tween(this).to({scrollerpos: -2200},10000).onComplete(this.scrollover.bind(this)).start();
            me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        },

        scrollover: function()
        {
          //  this.scrollerpos = 640;
           // this.scrollertween.to({scrollerpos: -2500}, 10000).onComplete(this.scrollover.bind(this)).start();
        },
        update: function()
        {
            if (me.input.isKeyPressed('enter'))
            {
                //loadMap("Chunk");
                me.state.change(me.state.PLAY);
            }
        },

        draw: function(context)
        {
            me.video.clearSurface(context,"white");
            context.drawImage(this.title, 0, 0);
            //this.font.draw(context, "Press Enter", 150, 440);
           // this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
        },

        onDestroyEvent: function()
        {
            me.input.unbindKey(me.input.KEY.ENTER);
            //this.scrollertween.stop();
        }
    });
