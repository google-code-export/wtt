var Generator = {

    debugMapArray : undefined,

    LEFT : 4,
    RIGHT : 6,
    UP : 8,
    DOWN : 2,

    chance : function (pct) {
      return Math.random()*100 < pct;
    },

    getChunkRelative : function(x,y,face) {
        var xx = x;
        var yy = y;
        if(face==this.LEFT) xx--;
        if(face==this.RIGHT) xx++;
        if(face==this.UP) yy--;
        if(face==this.DOWN) yy++
        this.getChunk(xx,yy);
        //return this.debugMapArray[xx][yy];
    },

    getRelative : function(x, y, face) {
        var xx = x;
        var yy = y;
        if(face==this.LEFT) xx--;
        if(face==this.RIGHT) xx++;
        if(face==this.UP) yy--;
        if(face==this.DOWN) yy++
        return {x:xx, y:yy};
    },

    generateResource : function(amt,spread,chunk,resource, amtVariants) {
        // random 1 wood and 1 stone depots
        var a = amt;
        while(a--) {
            var randomX = Math.floor(Math.random() * 20);
            var randomY = Math.floor(Math.random() * 20);
            chunk.chunkTiles[randomX][randomY] = C.tiles[resource+amtVariants]; // wont
            // spreading
            //console.log("will spread");
            var s = spread;
            while(s--) {
                var randomFace = Generator.randomFace();
                //console.log("face : "+randomFace);
                var rel = this.getRelative(randomX, randomY, randomFace);
                if(rel.x < 0 || rel.x >= 20 || rel.y < 0 || rel.y >= 20)  {
                    //spread++;
                    continue;
                }
                chunk.chunkTiles[rel.x][rel.y] = C.tiles[resource+amtVariants];
                randomX = rel.x;
                randomY = rel.y;
            }
        }
    },

    hasTileNearby : function(chunk, x, y, tile) {
      var c = 2;
        var list = new Array();
      for(c = 2 ; c <= 8 ; c+=2) {
          var rel = this.getRelative(x,y,c);
        //  console.log("c = "+c);
          if(rel.x < 0 || rel.x >= 20 || rel.y < 0 || rel.y >= 20)  {
             continue;
          }
        //  console.log(chunk);
          if( tile==undefined || chunk.chunkTiles[rel.x][rel.y])
          list.push(rel);
      }
      return list;
    },

    listNearTiles : function(chunk, x, y) {
        var c = 2;
        var list = new Array();
        for(c = 2 ; c <= 8 ; c+=2) {
            var rel = this.getRelative(x,y,c);
             list.push(rel);
        }
        return list;
    },

    getNearbyChunks : function(x, y) {
        var c = 2;
        var list = new Array();
        for(c = 2 ; c <= 8 ; c+=2) {
            var rel = this.getRelative(x, y, c);
            var chunk = this.getChunk(rel.x, rel.y);
            list.push(chunk);
        }
        return list;
    },

    getTileInChunk : function(chunk, loc) {
        if(loc.x <0 || loc.x >= 20 || loc.y < 0 ||loc.y >= 20) {
            var otherChunk = undefined;
            if(loc.x < 0) {
                otherChunk = this.getChunkRelative(x,y,this.LEFT);
                return otherChunk.chunkTiles[20+loc.x][loc.y] = tile;
            } else if(loc.x >= 20){
                otherChunk = this.getChunkRelative(x,y,this.RIGHT);
            }else if(loc.y < 0){
                otherChunk = this.getChunkRelative(x,y,this.UP);
            }else if(loc.y >= 20) {
                otherChunk = this.getChunkRelative(x,y,this.DOWN);
            }
        }
    },

    spreadBiome : function(chunk, x,y, tile, range) {
            var nearby = this.listNearTiles(chunk, x,y);
            var ct = nearby.length;
            while(ct--) {
                var loc = nearby[ct];
                if(loc.x <0 || loc.x >= 20 || loc.y < 0 ||loc.y >= 20) {

                    // has not been generated yet
                    if(otherChunk==undefined) {
                        loc.id = tile;
                        this.addDebtTile(chunk,loc);
                    }
                }
                else
                    chunk.chunkTiles[loc.x][loc.y] = tile;
                range--;
                if(range>0)
                    this.spreadBiome(chunk, loc.x, loc.y, tile, range);
            }
    },

    generateChunk : function(type, cx, cy) {

        // generating terrain
        var chunk = new Chunk();

        chunk.chunkTiles = new Array(20);
        for(var x = 0 ; x < 20 ; x++) {
            chunk.chunkTiles[x] = new Array(20);
        }
        for(var x = 0 ; x < 20 ; x++) {
            for (var y = 0; y < 20; y++) {
                // if has deser nearby
                var desertluck =0.1;
                if(this.chance(desertluck)) {
                    chunk.chunkTiles[x][y] = C.tiles.sand;
                    this.spreadBiome(chunk, x, y, C.tiles.sand, 5);
                }
                else if(chunk.chunkTiles[x][y]==undefined)
                    chunk.chunkTiles[x][y] = C.tiles.grass;
            }
        }
        //console.log("will gen resources");
        if(type!=undefined) {
            if(type="newbie") {
               this.generateResource(3, 4, chunk, "stone", 3);
               this.generateResource(3, 5, chunk, "wood", 3);
               this.generateResource(1, 10, chunk, "wood", 3);
               this.generateResource(2, 4, chunk, "iron", 3);
            }
        }

        console.log("generating chunk "+cx+ " "+cy);
        chunk.x = cx;
        chunk.y = cy;
        return chunk;
    },




    // 4 8 6 2
    randomFace : function() {
        return (Math.round((Math.random()*3)+1)*2);
    },

    //////////// INTERFACES

    // @Tile.x
    // @Tile.y
    // @Tile.id
    addDebtTile : function(chunk, tile) {
        chunk.debtTiles.push(tile);
    },

    getChunk : function(x, y) {
        return this.map["x"+x+"y"+y];
    },

    saveChunk : function(chunk) {
        this.map["x"+chunk.x+"y"+chunk.y] = chunk;
    }


}