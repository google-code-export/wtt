jsApp.BuildArea = me.Renderable.extend({
    "init" : function init(clickFun,infoBuild) {
        var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
		
		this.clickFunction = clickFun; //here we create the variable to use the mouse events, needed.
        this.info = infoBuild;
        this.info.idVillage = 1;// NEED TO SEE THIS BETTER! MULTI-VILLAGES PROBLEM
        this.parent(new me.Vector2d(0, gameH-40), gameW, 40); //This is here we define the position in the screen
        this.floating = true;
        this.isPersistent = true;
        this.options = this.mainOptions;
        this.font = new me.Font("verdana", 14, "lime", "right");//getting the font.
        this.font.textBaseline = "bottom";

        //This is were we defines the size of the square for the construction
        this.x = 0;//position->Pixel
        this.y = 0;
        this.sizeX = 1;//size->Tiles
        this.sizeY = 1;
		
		this.clickFunction = undefined;


		
		me.input.registerMouseEvent("mousemove", me.game.viewport, (function(e) {
            //the event publish it's to bind functions on mouse events
            //this is needed for we do not lose the mouse events for other functions
		    me.event.publish("moveBuilding");

        }).bind(this));
		
		this.mouseMove = (function() {
            //This code it's to fix the bug in case we move the screen during a construction
            //because we cant have a construction in the middle of a tile
            //the getTileForPixels it's the function that returns the exact tile
            //based in the pixel position of the mouse (me.input.touches[0].x, me.input.touches[0].y)
			var tileIs = jsApp.getTileForPixels(me.input.touches[0].x, me.input.touches[0].y);
			this.x = tileIs.x * 64 - me.game.viewport.pos.x;
			this.y = tileIs.y * 64 - me.game.viewport.pos.y;
		}).bind(this);
		
		this.mouseDown = (function () {
            //TAKING ALL THE DATA TO SEND TO SERVER
		    var building = infoBuild;
			var buildPos = jsApp.getTileForPixels(me.input.touches[0].x, me.input.touches[0].y);
			var tileid = buildLayer.getTileId(me.input.touches[0].x, me.input.touches[0].y);// getting the current tileid we've clicked on
			var type = "onConstruct";
            building.x = buildPos.x;
            building.y = buildPos.y;
			building.idVillage = building.idVillage; // --> NEED TO SEE THIS BETTER
			console.log("FROM Build Area --- idVillage:"+building.idVillage+" idBuilding:"+building.idBuilding+" x:"+building.x+" y:"+building.y+" buildTimer:"+building.buildTimer);
			buildLayer.setTile(buildPos.x,buildPos.y,22);//changing the tile for the construction zone
			jsApp.timeScheduler(type,building);// sending the construction to the scheduler.
			me.game.remove(this,true);
		}).bind(this);


		me.input.registerMouseEvent("mousedown", me.game.viewport, (function(e) {
				me.event.publish("placeBuilding");
		}).bind(this));

        //binding the function on the mouse event
		me.event.subscribe("placeBuilding", this.mouseDown);
		me.event.subscribe("moveBuilding", this.mouseMove);

    },

	"destroy" : function destroy() {
        //When this is destroyed, unbind the functions on the mouse events
		me.event.unsubscribe("placeBuilding", this.mouseDown);
		me.event.unsubscribe("moveBuilding", this.mouseMove);
    },

    "update" : function update() {
		return true;
    },

    "draw" : function(context) {
        // Transparent background
        var alpha = context.globalAlpha;
        context.globalAlpha = 0.1;
        context.fillStyle = "blue";
        context.fillRect(this.x, this.y,this.sizeX * 64, this.sizeY * 64);
    }
});