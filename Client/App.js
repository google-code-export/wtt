gameW = 800;
gameH = 600;
var timeouts = [];
var jsApp	 =
{
    // Initialize the jsApp
	//get user information//
    getUserData : function() {
      return $.jStorage.get("userData");
    },
    getRandom : function(min, max) {
        return Math.floor((Math.random()*max)+min);
    },
	//WebSocket connection setup//
    getSocket : function() {
		return  io.connect('199.241.31.175');
    },
	//WebSocket Send Function //
    send: function(title, obj) {
            this.getSocket().emit(title, obj);
    },
	//WebSocket Remove Listeners //
    destroy: function(title) {
        this.getSocket().removeAllListeners(title);
    },
	
    loadLevel: function() {

    },
	//Get user session //
    getUserSession: function(){

        var userData = {"idUser" : 3};
        return userData;

    },
    getRandomPointInScreen : function () {
        return pos = {
            x : jsApp.getRandom(me.game.viewport.pos.x, me.game.viewport.pos.x + me.game.viewport.width),
            y : jsApp.getRandom(me.game.viewport.pos.y, me.game.viewport.pos.y + me.game.viewport.height)
        };
    },
	//Melon Dialog //
    simpleDialog : function(msg)
    {

        me.game.addHUD(gameW/2,gameH/2,260,64);
        me.game.HUD.addItem("caixaTexto", new ChatDialog(0,0, msg,"Message:", undefined));
        me.game.sort();
    },
	
	//THIS IS THE TIMER SCHEDULER TO ADD ANYTHING THAT NEED TO RUN IN TIME //
	timeScheduler : function(data,time)
	{
		timeouts.push(setTimeout(data,time));
	},
	
	clearTimeOuts : function(){	
		var highestTimeoutId = setTimeout(";");
		for (var i = 0 ; i < highestTimeoutId ; i++) {
			clearTimeout(i); 
		}
	},
	
	//THIS GET THE ACTUAL SYSTEM TIME AND RETURN IN YYYY-MM-DD HH:MM:SS OR HH:MM:SS
	getSystemDate : function(type)
	{
		now = new Date();
	    if(type == "full"){
			year = "" + now.getFullYear();
			month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

	    }

		if(type == "time"){
			hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return hour + ":" + minute + ":" + second;
		}

	},
	
	//THIS TRANSFORM HH:MM:SS TO MS
	timeToMs : function(time)
	{
		var hms = time;   // your input string
		var a = hms.split(':'); // split it at the colons
		var ms = ((((+a[0]) * 60) * 60) + ((+a[1]) * 60) + (+a[2]))*1000; 
		return ms;
	},
	//THIS TRANSFORM MS TO HH:MM:SS
    msToTime : function(time)
    {
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		
		var elapsed_hours = Math.floor(time / 3600000);
		var remaining = time - (elapsed_hours * 3600000);
		var elapsed_minutes = Math.floor(remaining / 60000);
		remaining = remaining - (elapsed_minutes * 60000);
		var elapsed_seconds = Math.floor(remaining / 1000);
		remaining = remaining - (elapsed_seconds * 1000);
		var elapsed_fs = Math.floor(remaining / 10);
		
		if(elapsed_hours < 10)  { hours   = "0"+elapsed_hours;  }else{ hours   = elapsed_hours;  }
		if(elapsed_minutes < 10){ minutes = "0"+elapsed_minutes;}else{ minutes = elapsed_minutes;}
		if(elapsed_seconds < 10){ seconds = "0"+elapsed_seconds;}else{ seconds = elapsed_seconds;}

		var hrs = hours+":"+minutes+":"+seconds;
		return hrs;
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
        if (!me.video.init("screen", gameW, gameH, undefined,"auto", true))
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
		// the outworld gama screen
		me.state.set(me.state.OUTWORLD, new OutWorldScreen());
        // adicionando os tipos de entidade na POOL de memória
        me.entityPool.add("unit", Unit);

        //me.entityPool.add("entity", entity);
        me.state.change(me.state.PLAY);
    },
	//SEND THE PIXEL POSITION AND RETURN THE TILE POSITION //
	 getPixelsForTile : function(px,py) {
		    var x =  Math.floor(px);
            var y =  Math.floor(py);
            var imX = Math.floor((x+ me.game.viewport.pos.x)/64);
            var imY = Math.floor((y+ me.game.viewport.pos.y)/64);
			return {
				x : imX,
				y : imY
			};
	},
	//SEND THE TILE POSITION AND RETURN THE PIXEL POSITION
    getTileForPixels : function(px,py) {
        var x =  Math.floor(px);
        var y =  Math.floor(py);
        var imX = Math.floor((x*64));
        var imY = Math.floor((y*64));
        return {
            x : imX,
            y : imY
        };
    },
	//BRING ONLY THE FIRST CHAR TO THE UPPERCASE
	toTitleCase : function(str)
	{
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
};

var gameHandler =  {
	activeHuds : {
		buildMenu : undefined,
		buildingArea : undefined,
		buildingHUD: undefined,
		buildingList : undefined
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
