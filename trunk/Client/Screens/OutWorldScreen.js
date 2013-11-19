var OutWorldScreen = me.ScreenObject.extend(
    {
		
        onResetEvent: function () {
			me.game.reset();
			var socket         			 = jsApp.getSocket();
            var idWorld        			 = 1; //-->NEED TO SEE THIS BETTER!!
			var userData				 = jsApp.getUserData();
			this.TMXTileMap   			 = "OutWorld";
			this.font          			 = new me.Font("verdana", 18, "white", "left");
			
			//GAME CAMERA
			this.mousedown = false;
            this.mousemoved = false;
            this.mousemove = new me.Vector2d();
            this.mousedelta = new me.Vector2d();
			
			 //Destroying websockets event before create a new one	
			jsApp.destroy("onListWorldVillage");
			jsApp.destroy("onVillageSelect");
			jsApp.destroy("onListSquadAtk");
			jsApp.destroy("onAtkVillage");
			jsApp.destroy("onAtkQuest");
			jsApp.destroy("onAtkTemple");
			jsApp.destroy("onAlertTempleConquest");
			
			 /////////////////////////////////////////
			 
			 socket.emit("onListWorldVillage");
			////////////////////////////////////
			//WORLD SOCKETS			         //
			//////////////////////////////////
			
			//////////////////////////
			//IF IM BEING ATTACKED //
			var alertAtkFun = function(data){
				//if im the user being attacked
				if(userData.userId == data.idUser){
					socket.emit("onListWorldVillage");
					me.game.remove(this, true);
					me.state.change(me.state.OUTWORLD);
					alert(data.Msg);
				}
			}
			socket.on("onAlertUserAtk", alertAtkFun);
			////////////////////////
			
			/////////////////////////////////
			//IF THE TEMPLE WAS DOMINATED //
			var AlertTempleFun = function(rows){
				console.log(rows);
				alert('entrei no alert temple');
				var time = "03:00:00";
				this.templeTime = new jsApp.TempleTimeOut(time);// creating a new instance of the class TempleTimeOut
				me.game.add(this.templeTime,10);
			}
			socket.on("onAlertTempleConquest", AlertTempleFun);
			////////////////////////
			
			//////////////////////////////////////////////
			//LISTING THE USERS VILLAGES IN THE OUT WORLD
			var listWorldVillageFun = function(rows){
				var worldNames    =  new Array();
                var buildLayer    =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
                for (var i in rows[0]){
                    if (i!="remove"){
						console.log(rows[0][i]);
                        var idTile      = rows[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
						var pixelIs     = jsApp.getTileForPixels(rows[0][i].posX,rows[0][i].posY);
						var x		    = rows[0][i].posX;
						var y		    = rows[0][i].posY;
						var playerName  = rows[0][i].Nick;
						if(idTile == 38){playerName = "The Temple";}
						var villageInfo = {"playerName" : playerName, "x" : pixelIs.x, "y" : pixelIs.y};
                        buildLayer.setTile(x,y,idTile);//changing the tile
						var names = new jsApp.WorldNames(villageInfo);
						me.game.add(names,10);
						me.game.sort();
						worldNames.push(names);
						//SENDING USER SCREEN TO HIS VILLAGE POSITION.
						if(rows[0][i].idVillage == userData.idVillage){
							me.game.viewport.move(pixelIs.x,pixelIs.y);
						}
                    }
                }
				gameHandler.activeHuds.worldNames = worldNames;
				//console.log(gameHandler.activeHuds.worldNames);
            }
			socket.on("onListWorldVillage", listWorldVillageFun);
			////////////////////////////////////////////////////
			
			//////////////////////////////////////////////////
			//VERIFYING IN WHAT VILLAGE I CLICKED
			var villageSelectFun = function(rows, data){
				//var pixelIs = jsApp.getTileForPixels(data.x,data.y);
				if(rows[0][0].Msg == "Your Village"){var type = "Friend"; }else{var type = "Enemy";}
				console.log(rows[0][0]);
				var idVillage    = rows[0][0].idVillage;
				var villageOwner = rows[0][0].VillageOwner;
				var isTemple	 = rows[0][0].isTemple;
				var actionWorldMenu = new jsApp.WorldBuildingOptions(type,idVillage,villageOwner,data.pixelIs,data.x,data.y,isTemple);
				me.game.add(actionWorldMenu,10);
				me.game.sort();
			}
			socket.on("onVillageSelect", villageSelectFun);
			
			///////////////////////////////////////////
			
			
			//////////////////////////////////////////////////
			//LISTING SQUADS TO ATTACK THE VILLAGE OR DUNGEON THAT I CLIKED
			var listSquadAtkQuestFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
				div.setAttribute("id","dialogAtkSquadQuest");
				div.setAttribute("name","dialogAtkSquadQuest");
				div.setAttribute("title","Select the Squad to explore :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogAtkSquadQuest" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox[id*='atkSquadQuest_']").attr("checked",true);
						},

						"Send" : function(){
							//ENGAGING ATTACK IN THE VILLAGE I CLICKED
							var idVillageDef    = data.idAtkVillage;
							var userData	    = jsApp.getUserData();
							var villageOwner    = data.villageOwner;
							var isTemple        = "";
							if(data.isTemple == undefined){isTemple = 'N';}else{isTemple = data.isTemple;}
							var idSquadVillage  = "";
							$("input:checkbox[id*='atkSquadQuest_']:checked").each(function(i, obj){
								idSquadVillage = idSquadVillage + $(this).val()+",";
							});
							if(idSquadVillage.length != 0){
								//clearing the last char
								idSquadVillage = idSquadVillage.substring(0,(idSquadVillage.length - 1));
								//if im attacking a dungeon
								socket.emit('onAtkQuest',{"IdSquadAtk" : idSquadVillage, "x" : data.x, "y" : data.y, "userId" : jsApp.getUserData().userId});
								$( "#dialogAtkSquadQuest" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Squads was selected!');
							}

						},
						
						Cancel: function() {
							$( "#dialogAtkSquadQuest" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogAtkSquadQuest").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUAD RADIOBOXES
				var atkSquadContentQuest = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						var atkSquad = 	rows[0][i].Msg; 
					}else{
						var squad 	 = rows[0][i];
						var atkSquad = "<br> <input type='checkbox' name='atkSquadQuest' id='atkSquadQuest_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' >"+squad.SquadName+"</input>";
					}
					atkSquadContentQuest  = atkSquadContentQuest + atkSquad;
				});
				
				$("#dialogAtkSquadQuest").append(atkSquadContentQuest);
				$("#dialogAtkSquadQuest").dialog("open");
			}
			socket.on("onListSquadAtkQuest", listSquadAtkQuestFun);
			
			//////////////////////////////////////////
			
			///////////////////////////////////////////
			//RESULT OF THE ATTACK QUEST
			var atkQuestFun =  function(rows, data){
				console.log(rows);
				alert(rows[0][0].Msg);
				me.game.remove(this, true);
				me.state.change(me.state.OUTWORLD);
			}
			socket.on("onAtkQuest",atkQuestFun);
			///////////////////////////////////////////
			
			//////////////////////////////////////////////////
			//LISTING SQUADS TO ATTACK THE VILLAGE OR DUNGEON THAT I CLIKED
			var listSquadAtkUserFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
				div.setAttribute("id","dialogAtkSquadUser");
				div.setAttribute("name","dialogAtkSquadUser");
				div.setAttribute("title","Select the Squad to attack :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogAtkSquadUser" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox[id*='atkSquad_']").attr("checked",true);
						},

						"Send" : function(){
							//ENGAGING ATTACK IN THE VILLAGE I CLICKED
							var idVillageDef    = data.idAtkVillage;
							var userData	    = jsApp.getUserData();
							var villageOwner    = data.villageOwner;
							var isTemple        = "";
							if(data.isTemple == undefined){isTemple = 'N';}else{isTemple = data.isTemple;}
							var idSquadVillage  = "";
							$("input:checkbox[id*='atkSquadUser_']:checked").each(function(i, obj){
								idSquadVillage = idSquadVillage + $(this).val()+",";
							});
							if(idSquadVillage.length != 0){
								//clearing the last char
								idSquadVillage = idSquadVillage.substring(0,(idSquadVillage.length - 1));
								//if im attacking a village
								socket.emit('onAtkVillage',{"IdSquadAtk" : idSquadVillage, "IdVillagDef" : idVillageDef, "userId" : jsApp.getUserData().userId, "villageOwner" : villageOwner});
								$( "#dialogAtkSquadUser" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Squads was selected!');
							}

						},
						
						Cancel: function() {
							$( "#dialogAtkSquadUser" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogAtkSquadUser").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUAD RADIOBOXES
				var atkUserSquadContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						var atkSquad = 	rows[0][i].Msg; 
					}else{
						var squad 	 = rows[0][i];
						var atkSquad = "<br> <input type='checkbox' name='atkSquadUser' id='atkSquadUser_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' >"+squad.SquadName+"</input>";
					}
					atkUserSquadContent  = atkUserSquadContent + atkSquad;
				});
				
				$("#dialogAtkSquadUser").append(atkUserSquadContent);
				$("#dialogAtkSquadUser").dialog("open");
			}
			socket.on("onListSquadAtkUser", listSquadAtkUserFun);			
			///////////////////////////////////////////
			//RESULT OF THE ATTACK VILLAGE
			var atkVillageFun =  function(rows, data){
				alert(rows[0][0].Msg);
				me.game.remove(this, true);
				me.state.change(me.state.OUTWORLD);
			}
			socket.on("onAtkVillage",atkVillageFun);
			
			///////////////////////////////////////////
			
			//////////////////////////////////////////////////
			//LISTING SQUADS TO ATTACK THE VILLAGE OR DUNGEON THAT I CLIKED
			var listSquadAtkTempleFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
				div.setAttribute("id","dialogAtkSquadTemple");
				div.setAttribute("name","dialogAtkSquadTemple");
				div.setAttribute("title","Select the Squad to attack The Temple :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogAtkSquadTemple" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox[id*='atkSquadTemple_']").attr("checked",true);
						},

						"Send" : function(){
							//ENGAGING ATTACK IN THE VILLAGE I CLICKED
							var idVillageDef    = data.idAtkVillage;
							var userData	    = jsApp.getUserData();
							var villageOwner    = data.villageOwner;
							var isTemple        = "";
							if(data.isTemple == undefined){isTemple = 'N';}else{isTemple = data.isTemple;}
							var idSquadVillage  = "";
							$("input:checkbox[id*='atkSquadTemple_']:checked").each(function(i, obj){
								idSquadVillage = idSquadVillage + $(this).val()+",";
							});
							if(idSquadVillage.length != 0){
								//clearing the last char
								idSquadVillage = idSquadVillage.substring(0,(idSquadVillage.length - 1));
								//if im attacking the temple
								console.log(data);
								socket.emit('onAtkTemple',{"IdSquadAtk" : idSquadVillage, "x" : data.x, "y" : data.y, "IdVillagDef" : idVillageDef , "userId" : jsApp.getUserData().userId});
								$( "#dialogAtkSquadTemple" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Squads was selected!');
							}

						},
						
						Cancel: function() {
							$( "#dialogAtkSquadTemple" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogAtkSquadTemple").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUAD RADIOBOXES
				var atkSquadTempleContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						var atkSquad = 	rows[0][i].Msg; 
					}else{
						var squad 	 = rows[0][i];
						var atkSquad = "<br> <input type='checkbox' name='atkSquadTemple' id='atkSquadTemple_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' >"+squad.SquadName+"</input>";
					}
					atkSquadTempleContent  = atkSquadTempleContent + atkSquad;
				});
				
				$("#dialogAtkSquadTemple").append(atkSquadTempleContent);
				$("#dialogAtkSquadTemple").dialog("open");
			}
			socket.on("onListSquadAtkTemple", listSquadAtkTempleFun);
			
			///////////////////////////////////////////
			//RESULT OF THE ATTACK TEMPLE
			var atkTempleFun =  function(rows, data){
				alert(rows[0][0].Msg);
				me.game.remove(this, true);
				me.state.change(me.state.OUTWORLD);
			}
			socket.on("onAtkTemple",atkTempleFun);
			///////////////////////////////////////////
			
            /////////////////
            // GAME CAMERA //
            /////////////////

            me.input.registerPointerEvent("mousedown", me.game.viewport, (function (e) {
                this.mousedown = true;
                this.mousemove = new me.Vector2d(~~me.input.changedTouches[0].x,~~me.input.changedTouches[0].y);
				//IF I HAVE ANY WORLD VILLAGE ACTION MENU OPEN
				if(gameHandler.activeHuds.actionWorldMenu != undefined){
					//IF I CLICKED IN 'ENTER' BUTTON
					if(gameHandler.activeHuds.actionWorldMenu.enterRect != undefined){
						if(gameHandler.activeHuds.actionWorldMenu.enterRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
						
								userData.idVillage = gameHandler.activeHuds.actionWorldMenu.idVillage;
								$.jStorage.set("userData", userData);					
								me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
								gameHandler.activeHuds.actionWorldMenu = undefined;
								me.state.change(me.state.PLAY);
						}
					}
					//IF IT'S ANOTHER USER VILLAGE
					if(gameHandler.activeHuds.actionWorldMenu != undefined){
						if(gameHandler.activeHuds.actionWorldMenu.attackRect != undefined){
							//IF I CLICKED IN 'ATTACK' BUTTON
							if(gameHandler.activeHuds.actionWorldMenu.attackRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
							
								var idAtkVillage = gameHandler.activeHuds.actionWorldMenu.idVillage;
								var villageOwner = gameHandler.activeHuds.actionWorldMenu.villageOwner;
								var isTemple     = 'N';
								socket.emit('onListSquadAtkUser',{"idUserVillage" : userData.idVillage, "idAtkVillage" : idAtkVillage, "villageOwner" : villageOwner, "isTemple" : isTemple, "userId" : userData.userId});
								me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
								gameHandler.activeHuds.actionWorldMenu = undefined;
							}
						}
						if(gameHandler.activeHuds.actionWorldMenu.tradeRect != undefined){
							//IF I CLICKED IN 'TRADE' BUTTON
							if(gameHandler.activeHuds.actionWorldMenu.tradeRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
							
							}
						}
						if(gameHandler.activeHuds.actionWorldMenu.msgRect != undefined){
							//IF I CLICKED IN 'SEND MSG' BUTTON
							if(gameHandler.activeHuds.actionWorldMenu.msgRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
							
							}
						}

					}
					//IF IT'S A QUEST
					if(gameHandler.activeHuds.actionWorldMenu != undefined){
						//IF I CLICKED IN 'EXPLORE' BUTTON
						if(gameHandler.activeHuds.actionWorldMenu.exploreRect != undefined){
							if(gameHandler.activeHuds.actionWorldMenu.exploreRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
								var idAtkVillage = gameHandler.activeHuds.actionWorldMenu.idVillage;
								var villageOwner = gameHandler.activeHuds.actionWorldMenu.villageOwner;
								var x			 = gameHandler.activeHuds.actionWorldMenu.x;
								var y			 = gameHandler.activeHuds.actionWorldMenu.y;
								socket.emit('onListSquadAtkQuest',{"idUserVillage" : userData.idVillage, "idAtkVillage" : idAtkVillage, "villageOwner" : villageOwner, "x" : x, "y" : y, "userId" : userData.userId});
								me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
								gameHandler.activeHuds.actionWorldMenu = undefined;
							}
						}
					}
					//IF IT'S THE TEMPLE
					if(gameHandler.activeHuds.actionWorldMenu != undefined){
						//IF I CLICKED IN 'ATTACK TEMPLE' BUTTON
						if(gameHandler.activeHuds.actionWorldMenu.attackTempleRect != undefined){
							if(gameHandler.activeHuds.actionWorldMenu.attackTempleRect.containsPoint(~~e.gameWorldX, ~~e.gameWorldY)){
								var idAtkVillage = gameHandler.activeHuds.actionWorldMenu.idVillage;
								var villageOwner = gameHandler.activeHuds.actionWorldMenu.villageOwner;
								var x			 = gameHandler.activeHuds.actionWorldMenu.x;
								var y			 = gameHandler.activeHuds.actionWorldMenu.y;
								var isTemple     = gameHandler.activeHuds.actionWorldMenu.isTemple;
								socket.emit('onListSquadAtkTemple',{"idUserVillage" : userData.idVillage, "idAtkVillage" : idAtkVillage, "villageOwner" : villageOwner, "x" : x, "y" : y, "userId" : userData.userId, "isTemple" : isTemple});
								me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
								gameHandler.activeHuds.actionWorldMenu = undefined;								
							}
						}
					}
					
					//IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
					me.game.remove(gameHandler.activeHuds.actionWorldMenu,true);
					gameHandler.activeHuds.actionWorldMenu = undefined;
					//
				//IF I DONT HAVE ANY WORLD VILLAGE ACTION MENU OPEN
				}else{
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs     = jsApp.getPixelsForTile(~~e.gameScreenX, ~~e.gameScreenY);
					var pixelIs	   = jsApp.getTileForPixels(tileIs.x, tileIs.y);
					var tileid     = buildLayer.getTileId(~~e.gameWorldX, ~~e.gameWorldY);// getting the current tileid we've clicked on

					//IF I CLICKED IN SOMETHING I'LL SEE WHAT IT'S AND CREATE A ACTION MENU
					if (tileid != null){ 
						socket.emit("onVillageSelect",{"idUser" : userData.userId, "x" : tileIs.x, "y" : tileIs.y, "pixelIs" : pixelIs});
					}
				}
				
            }).bind(this));

            me.input.registerPointerEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));
			
			//MOVES GAME CAMERA
            me.input.registerPointerEvent("mousemove", me.game.viewport, (function (e) {
                if (this.mousedown == true) {

                    var pos = new me.Vector2d(
                        ~~me.input.changedTouches[0].x,
                        ~~me.input.changedTouches[0].y
                    );
                    this.mousedelta.copy(pos);
                    this.mousedelta.sub(this.mousemove);

                    this.mousemove.copy(pos);
                    this.mousemoved = true;

                }
            }).bind(this));
			
			//ADD ACTION GUI TO THE SCREEN
			this.gui = new jsApp.ActionMenu("World");
			me.game.add(this.gui, 3000);
			me.game.sort();
            // LOADS THE MAIN MAP (DEBUG, WILL CHANGE)
            loadMap("OutWorld");
            // SORT GRAPHICS RENDERED TO THE SCREEN (SO IT CAN REDRAW IN THE RIGHT ORDER)
            
			this.parent();
        },
		
        "draw": function (context) {
            // Transparent background
            var alpha = context.globalAlpha;
            context.globalAlpha = 0.6;
            context.fillStyle = "#000";
            context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            context.globalAlpha = alpha;
        },

        onUpdateFrame: function () {

            if (this.mousedown) {
                if (this.mousedelta.x || this.mousedelta.y) {
                    // Move viewport
                    me.game.viewport.move(-this.mousedelta.x * 1.2, -this.mousedelta.y * 1.2);
                }

                // Reset mousedelta
                this.mousedelta.setZero();
            }

            // call superclass constructor
            this.parent();
            return true;
        },
        "update": function update() {
            return true;
        },
        onDestroyEvent: function() {
            me.input.releasePointerEvent("mousedown", me.game.viewport);
            me.input.releasePointerEvent("mouseup", me.game.viewport);
            me.input.releasePointerEvent("mousemove", me.game.viewport);
			me.game.remove(gameHandler.activeHuds.worldNames, true);
			gameHandler.activeHuds.worldNames = undefined;
			me.game.remove(this.gui,true);
			me.game.sort();
			
			//Destroying websockets event before create a new one	
			jsApp.destroy("onListWorldVillage");
			jsApp.destroy("onVillageSelect");
			jsApp.destroy("onListSquadAtk");
			jsApp.destroy("onAtkVillage");
			jsApp.destroy("onAtkQuest");
			jsApp.destroy("onAtkTemple");
			jsApp.destroy("onAlertTempleConquest");
			/////////////////////////////////////////
        }
    });



// called whenever a new map gets loaded by the client
// Parameters
// - String MapName
function loadMap(mapname) {
    me.levelDirector.loadLevel(mapname);
    me.game.sort();
}

function createArrayMap(length) {
    var a = new Array(length || 0);

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < length; i++) {
            a[i] = createArray.apply(this, args);
        }
    }

    return a;
}


