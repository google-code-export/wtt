gameW = 800;
gameH = 600;
var jsApp	=
{
    // Initialize the jsApp

    socket : io.connect('http://108.170.35.55'),

    getUserData : function() {
      return $.jStorage.get("userData");
    },

    getSocket : function() {
        return  io.connect('http://108.170.35.55');
    },

    send: function(title, obj) {
            this.getSocket().emit(title, obj);
    },

    destroy: function(title) {
        this.getSocket().removeAllListeners(title);
    },

    loadLevel: function() {

    },

    getUserSession: function(){

        var userData = {"idUser" : 3};
        return userData;

    },

    // this method is called when the app is initialized
    onload: function()
    {

        // Game engine settings.
        me.sys.gravity = 0;
        me.sys.dirtyRegion = true; // Be fast!
        me.sys.preRender = false; // NEED TO BE FALSE TO CHANGE THE TILES IN MAP!
        me.sys.useNativeAnimFrame = true; // Be fastest!
        me.sys.stopOnAudioError = false;
        if (!me.video.init("screen", gameW, gameH, undefined, "auto", true))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }
        me.audio.init("ogg");
        // loading screen
        me.game.onLevelLoaded = this.loadLevel.bind(this);
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_resources);
        me.state.change(me.state.LOADING);
    },

    loaded: function ()
    {
        // creating our title screen
        me.state.set(me.state.MENU, new TitleScreen());
        // the main game screen
        me.state.set(me.state.PLAY, new PlayScreen());
        // adicionando os tipos de entidade na POOL de memória
        me.entityPool.add("unit", Unit);

        //me.entityPool.add("entity", entity);
        me.state.change(me.state.PLAY);
    },

	 getTileForPixels : function(px,py) {
		    var x =  Math.floor(px);
            var y =  Math.floor(py);
            var imX = Math.floor((x+ me.game.viewport.pos.x)/64);
            var imY = Math.floor((y+ me.game.viewport.pos.y)/64);
            //var fx =  imX*64;
            //var fy = imY*64;
			return {
				x : imX,
				y : imY
			};
	}

};

var gameHandler =  {
	activeHuds : {
	}
}


function include(filename)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}
