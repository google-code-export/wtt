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
				var idVillage    = rows[0][0].idVillage;
				var villageOwner = rows[0][0].VillageOwner;
				var actionWorldMenu = new jsApp.WorldBuildingOptions(type,idVillage,villageOwner,data.pixelIs,data.x,data.y);
				me.game.add(actionWorldMenu,10);
				me.game.sort();
			}
			socket.on("onVillageSelect", villageSelectFun);
			
			///////////////////////////////////////////
			
			
			//////////////////////////////////////////////////
			//LISTING SQUADS TO ATTACK THE VILLAGE OR DUNGEON THAT I CLIKED
			var listSquadAtkFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
				//IF I CLICKED IN AN QUEST
				if(data.villageOwner == null){
					var dialogTitle = "Select the Squad to explore :";
				}else{
					var dialogTitle = "Select the Squad to attack :"
				}
				div.setAttribute("id","dialogAtkSquad");
				div.setAttribute("name","dialogAtkSquad");
				div.setAttribute("title",dialogTitle);
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogAtkSquad" ).dialog({
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
							var idVillageDef = data.idAtkVillage;
							var userData	 = jsApp.getUserData();
							var villageOwner = data.villageOwner;
							var idSquadVillage   = "";
							$("input:checkbox[id*='atkSquad_']:checked").each(function(i, obj){
								idSquadVillage = idSquadVillage + $(this).val()+",";
							});
							
							//clearing the last char
							idSquadVillage = idSquadVillage.substring(0,(idSquadVillage.length - 1));
							//if im attacking a village
							if(villageOwner != null){
								socket.emit('onAtkVillage',{"IdSquadAtk" : idSquadVillage, "IdVillagDef" : idVillageDef, "userId" : jsApp.getUserData().userId, "villageOwner" : villageOwner});
							}else{
							//if im attacking a dungeon
								console.log(data);
								socket.emit('onAtkQuest',{"IdSquadAtk" : idSquadVillage, "x" : data.x, "y" : data.y, "userId" : jsApp.getUserData().userId});
							}
							$( "#dialogAtkSquad" ).html('');
							$( this ).dialog( "close" );
						},
						
						Cancel: function() {
							$( "#dialogAtkSquad" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogAtkSquad").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUAD RADIOBOXES
				var atkSquadContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						var atkSquad = 	rows[0][i].Msg; 
					}else{
						var squad 	 = rows[0][i];
						var atkSquad = "<br> <input type='checkbox' name='atkSquad' id='atkSquad_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' >"+squad.SquadName+"</input>";
					}
					atkSquadContent  = atkSquadContent + atkSquad;
				});
				
				$("#dialogAtkSquad").append(atkSquadContent);
				$("#dialogAtkSquad").dialog("open");
			}
			socket.on("onListSquadAtk", listSquadAtkFun);
			
			//////////////////////////////////////////
			
			///////////////////////////////////////////
			//RESULT OF THE ATTACK VILLAGE
			var atkVillageFun =  function(rows, data){
				alert(rows[0][0].Msg);
				me.game.remove(this, true);
				me.state.change(me.state.OUTWORLD);
			}
			socket.on("onAtkVillage",atkVillageFun);
			
			///////////////////////////////////////////
			
			///////////////////////////////////////////
			//RESULT OF THE ATTACK QUEST
			var atkQuestFun =  function(rows, data){
				alert(rows[0][0].Msg);
				me.game.remove(this, true);
				me.state.change(me.state.OUTWORLD);
			}
			socket.on("onAtkQuest",atkQuestFun);
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
								socket.emit('onListSquadAtk',{"idUserVillage" : userData.idVillage, "idAtkVillage" : idAtkVillage, "villageOwner" : villageOwner, "userId" : userData.userId});
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
								socket.emit('onListSquadAtk',{"idUserVillage" : userData.idVillage, "idAtkVillage" : idAtkVillage, "villageOwner" : villageOwner, "x" : x, "y" : y, "userId" : userData.userId});
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
					if (tileid != null){ //--> FIX ME THIS NEED TO FIND ALSO THE TEMPLE AND THE QUESTS
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


