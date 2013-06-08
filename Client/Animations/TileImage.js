var TileImage = me.AnimationSheet.extend({
    init : function() {
        var numberOfSprites = image.width / spritewidth;
        var image = me.loader.getImage("TileSet");
        this.parent(0,0, image,64, 64);
        this.z = 6000;
    }
});
