var g_resources =
    [
        // TILESETS //
        {name: "TileSet",	type: "image",	src: "data/sprite/TileSet.png"},

        // IMAGES //
        {name: "Title",	type: "image",	src: "data/sprite/Title.png"},

        // FONTS TITLES //
        {name: "BaseFont",type: "image",  src: "data/sprite/font.png"},

        // units //
        {name: "Farmer",type: "image",  src: "data/sprite/Characters/farmer.png"},

        // Resources //
        {name: "Wood" ,type: "image",  src: "data/sprite/Log.png"  },
        {name: "Army" ,type: "image",  src: "data/sprite/army.png" },
        {name: "Stone",type: "image",  src: "data/sprite/Stone.png"},
        {name: "Iron" ,type: "image",  src: "data/sprite/iron.png" },
        {name: "Meat" ,type: "image",  src: "data/sprite/Meat.png" },
        {name: "Coin" ,type: "image",  src: "data/sprite/coin.png" },

        //////////////
        // BASE TMX //
        //////////////
        {name: "area01",	type: "tmx",	src: "data/area01.tmx"},
        {name: "Chunk",	type: "tmx",	src: "data/Chunk.tmx"}
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
            barracks1:10

		}
	
	}