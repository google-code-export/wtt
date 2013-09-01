gameW = 800;
gameH = 600;
var jsApp	=
{
    // Initialize the jsApp
	
    getUserData : function() {
      return $.jStorage.get("userData");
    },

    getSocket : function() {
        //return  io.connect('http://199.115.231.229');192.168.0.190
		return  io.connect('http://192.168.0.190');
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

    simpleDialog : function(msg)
    {

        me.game.addHUD(gameW/2,gameH/2,260,64);
        me.game.HUD.addItem("caixaTexto", new ChatDialog(0,0, msg,"Message:", undefined));
        me.game.sort();
    },
	
	//THIS IS THE TIMER SCHEDULER TO ADD IN THE ROUTINE THE THINGS THAT ARE PENDING
	timeScheduler : function(type,data)
	{
		var systemtime = jsApp.getSystemDate("full");
		var time = jsApp.timeToMs(data.buildTimer);
		
		console.log("IM ON APP.JS --- idVillage:"+data.idVillage+" idBuilding:"+data.idBuilding+" x:"+data.x+" y:"+data.y+" buildTimer:"+data.buildTimer);
		console.log("time : "+systemtime);
		
		setTimeout(function(){socket.emit(type, data);},time);
		
	},
	
	//THIS GET THE ACTUAL SYSTEM TIME AND RETURN IN YYYY-MM-DD HH:MM:SS
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
	
	//THIS IS NEEDED TO HAVE THE RIGHT TIME IN MS TO SEND IT TO THE SCHEDULER
	timeToMs : function(time)
	{
		var hms = time;   // your input string
		var a = hms.split(':'); // split it at the colons
		var ms = ((((+a[0]) * 60) * 60) + ((+a[1]) * 60) + (+a[2]))*1000; 
		return ms;
	},

    msToTime : function(time)
    {
        var ms = time;
        var sec = time/1000;
        if(sec < 10){ sec = "0" + sec; }
        var min = sec/60;
        if(min < 10){ min = "0" + min;}
        var hr = min/60;
        if(hr < 10 ){ hr = "0" + hr;}
        var hrs = hr+":"+min+":"+sec;

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
        // adicionando os tipos de entidade na POOL de memória
        me.entityPool.add("unit", Unit);

        //me.entityPool.add("entity", entity);
        me.state.change(me.state.PLAY);
    },

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

    getTileForPixels : function(px,py) {
        var x =  Math.floor(px);
        var y =  Math.floor(py);
        var imX = Math.floor((x*64));
        var imY = Math.floor((y*64));
        return {
            x : imX,
            y : imY
        };
    }
};

var gameHandler =  {
	activeHuds : {
		buildMenu : undefined,
		buildingArea : undefined,
		buildingHUD: undefined
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
