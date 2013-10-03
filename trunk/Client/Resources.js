var g_resources =
    [
        // TILESETS //
        {name: "TileSet",	type: "image",	src: "data/sprite/TileSet.png"},

        // IMAGES //
        {name: "Title"   	 ,	type: "image",	src: "data/sprite/Title.png"},
		{name: "BuildImg"	 ,	type: "image",	src: "data/sprite/build.png"},
        {name: "WoodTexture" ,	type: "image",  src: "data/sprite/woodtexture.png"  },
		{name: "Clock" 		 ,	type: "image",  src: "data/sprite/Clock.gif"},

        // FONTS TITLES //
        {name: "BaseFont",type: "image",  src: "data/sprite/font.png"},

        // units //
        {name: "Farmer"		,	type: "image",  src: "data/sprite/Characters/farmer.png"},
        {name: "Lumberjack" ,	type: "image",  src: "data/sprite/Characters/lumberjack.png"},
		{name: "Ninja"		,	type: "image",  src: "data/sprite/Characters/ninja.png"},
		{name: "Soldier"	,	type: "image",  src: "data/sprite/Characters/soldier.png"},
		{name: "Archer"		,	type: "image",  src: "data/sprite/Characters/archer.png"},

        // faces
        {name: "maleFaces",type: "image",  src: "data/sprite/Characters/maleFaces.png"},


        // Resources //
        {name: "Wood"  ,type: "image",  src: "data/sprite/Log.png"  },
        {name: "Army"  ,type: "image",  src: "data/sprite/army.png" },
        {name: "Stone" ,type: "image",  src: "data/sprite/Stone.png"},
        {name: "Iron"  ,type: "image",  src: "data/sprite/iron.png" },
        {name: "Meat"  ,type: "image",  src: "data/sprite/Meat.png" },
        {name: "Coin"  ,type: "image",  src: "data/sprite/coin.png" },

        //////////////
        // BASE TMX //
        //////////////
        {name: "area01",	type: "tmx",	src: "data/area01.tmx"},
        {name: "Chunk" ,	type: "tmx",	src: "data/Chunk.tmx"}
    ];

	var C = {
        chunkSize : 20,
		tiles : {
			stone1 : 43, stone2 : 44, stone3: 45,
            wood1 : 32, wood2 : 33, wood3: 34,
            iron1: 35, iron2:36,iron3:37,
            grass: 30,sand:31, sea:41
		},
		buildings : {
			house1 : 0,
            archery1: 1,
            archery2: 2,
            barracks1:10,
            lumberjack: 3
		}
	
	}