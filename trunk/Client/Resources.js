var g_resources =
    [
        // TILESETS //
        {name: "TileSet",	type: "image",	src: "data/sprite/TileSet.png"},

        // IMAGES //
        {name: "Title"   	 ,	type: "image",	src: "data/sprite/Title.png"},
		{name: "BuildImg"	 ,	type: "image",	src: "data/sprite/build.png"},
        {name: "WoodTexture" ,	type: "image",  src: "data/sprite/woodtexture.png"  },
		{name: "Clock" 		 ,	type: "image",  src: "data/sprite/Clock.gif"},
		{name: "Hammer" 	 ,	type: "image",  src: "data/sprite/Hammer.png"},

        // FONTS TITLES //
        {name: "BaseFont",type: "image",  src: "data/sprite/font.png"},

        // units /////////////////////////////////////////////////////////////////////////////////////
		
		//ARCHER//
		{name: "Archer_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Archer_24x20.png"		},
		{name: "Archer_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Archer_48x40.png"		},
		{name: "Archer_Front" 	 	,	type: "image",  src: "data/sprite/Characters/Archer_Front.png"		},
		//
		//ARCHER MOUNT//
		{name: "Archer_Mount_39x37" ,	type: "image",  src: "data/sprite/Characters/Archer_Mount_39x37.png"},
		{name: "Archer_Mount_78x75" ,	type: "image",  src: "data/sprite/Characters/Archer_Mount_78x75.png"},
		{name: "Archer_Mount_Front" ,	type: "image",  src: "data/sprite/Characters/Archer_Mount_Front.png"},
        //
		//DEAD//
		{name: "Dead_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Dead_24x20.png"		},
		{name: "Dead_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Dead_48x40.png"		},
		//
		//FARMER//
		{name: "Farmer_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Farmer_24x20.png"		},
		{name: "Farmer_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Farmer_48x40.png"		},
		{name: "Farmer_Front" 	 	,	type: "image",  src: "data/sprite/Characters/Farmer_Front.png"		},
		//
		//MONK//
		{name: "Monk_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Monk_24x20.png"		},
		{name: "Monk_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Monk_48x40.png"		},
		{name: "Monk_Front" 	 	,	type: "image",  src: "data/sprite/Characters/Monk_Front.png"		},
		//
		//NINJA//
		{name: "Ninja_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Ninja_24x20.png"		},
		{name: "Ninja_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Ninja_48x40.png"		},
		{name: "Ninja_Front" 	 	,	type: "image",  src: "data/sprite/Characters/Ninja_Front.png"		},		
		//
		//PIKEMAN//
		{name: "Pikeman_24x20" 	 	,	type: "image",  src: "data/sprite/Characters/Pikeman_24x20.png"		},
		{name: "Pikeman_48x40" 	 	,	type: "image",  src: "data/sprite/Characters/Pikeman_48x40.png"		},
		{name: "Pikeman_Front" 	 	,	type: "image",  src: "data/sprite/Characters/Pikeman_Front.png"		},	
		//
		//SWORDMAN//
		{name: "Swordman_24x20" 	,	type: "image",  src: "data/sprite/Characters/Swordman_24x20.png"	},
		{name: "Swordman_48x40" 	,	type: "image",  src: "data/sprite/Characters/Swordman_48x40.png"	},
		{name: "Swordman_Front" 	,	type: "image",  src: "data/sprite/Characters/Swordman_Front.png"	},
		///////////////////////////////////////////////////////////////////////////////////////////////

        // faces
        {name: "maleFaces",type: "image",  src: "data/sprite/Characters/maleFaces.png"},


        // Resources //
        {name: "Wood"  ,type: "image",  src: "data/sprite/Log.png"  },
        {name: "Army"  ,type: "image",  src: "data/sprite/army.png" },
        {name: "Stone" ,type: "image",  src: "data/sprite/Stone.png"},
        {name: "Iron"  ,type: "image",  src: "data/sprite/iron.png" },
        {name: "Food"  ,type: "image",  src: "data/sprite/Meat.png" },
        {name: "Gold"  ,type: "image",  src: "data/sprite/Gold.png" },

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