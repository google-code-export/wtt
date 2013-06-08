jsApp.ResourcesHUD = me.Renderable.extend({
// create a "score object" that will use a Bitmap font
// to display the score value

    "init" : function init() {
        this.parent(new me.Vector2d(5,5,gameW,30));// position on the screen
        this.floating = true;
        this.isPersistent = true;

        this.WoodValue = 0;
        this.StoneValue = 0;
        this.FoodValue = 0;
        this.IronValue = 0;
        this.GoldValue = 0;

        this.font = new me.BitmapFont("BaseFont", 16);
        this.Woodimage  = me.loader.getImage("Wood") ;
        this.Stoneimage = me.loader.getImage("Stone");
        this.Ironimage  = me.loader.getImage("Iron") ;
        this.Meatimage  = me.loader.getImage("Meat") ;
        this.Coinimage  = me.loader.getImage("Coin") ;
        gameHandler.activeHuds["resourceHud"] = this;

        //getting the resources by websockets
        jsApp.destroy("onResourcesUpdate"); //Destroying websockets event before create a new one
        jsApp.send("onResourcesUpdate", jsApp.getUserSession()); //
        var socket = io.connect('http://199.115.231.229:8080');
        socket.on('onResourcesUpdate', function(data) {
            $.each(data, function(i, obj) {
                if(i>0)
                    return false;
                else{
                    //alert(obj[i].meat);
                    gameHandler.activeHuds["resourceHud"].WoodValue  = obj[i].wood;
                    gameHandler.activeHuds["resourceHud"].StoneValue = obj[i].stone;
                    gameHandler.activeHuds["resourceHud"].FoodValue  = obj[i].food;
                    gameHandler.activeHuds["resourceHud"].IronValue  = obj[i].iron;
                    gameHandler.activeHuds["resourceHud"].GoldValue  = obj[i].gold;
                }
            });

        });
    },

    distance : 60,

    // separate function so you dont need to calculate resources X and Y every draw frame
    calculatePositions : function () {

    },

    draw : function (context, x, y)
    {
        var iX = 20;
        context.globalAlpha = 0.6;
        context.fillStyle = "#00066";

        context.fillRect(0,0,gameW, 28);
        context.globalAlpha = 1;
        context.drawImage(this.Coinimage, this.pos.x, this.pos.y);
        this.font.draw (context, this.GoldValue, iX+this.pos.x , this.pos.y);

        iX += this.GoldValue.toString().length*16+20;
        context.drawImage(this.Woodimage, this.pos.x + iX, this.pos.y);
        iX += 20;
        this.font.draw (context, this.WoodValue, this.pos.x +iX, this.pos.y);

        iX += this.WoodValue.toString().length*16+20;
        context.drawImage(this.Stoneimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.StoneValue, this.pos.x +iX, this.pos.y);

        iX += this.StoneValue.toString().length*16+20;
        context.drawImage(this.Ironimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.IronValue, this.pos.x +iX, this.pos.y);

        iX += this.IronValue.toString().length*16+20;
        context.drawImage(this.Meatimage, this.pos.x + iX, this.pos.y);
        iX+=20;
        this.font.draw (context, this.FoodValue, this.pos.x +iX, this.pos.y);
    },

    "destroy" : function() {
        //remove socket connection
        jsApp.destroy("onResourcesUpdate");
    }

});
