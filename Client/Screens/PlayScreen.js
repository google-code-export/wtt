var PlayScreen = me.ScreenObject.extend(
    {
        onResetEvent: function () {
			me.game.reset();
			var socket       = jsApp.getSocket();
			var userData     = jsApp.getUserData();
            this.idVillage   = userData.idVillage;
			this.villageName = "";
			this.TMXTileMap  = "VillageArea";
			this.font        = new me.Font("verdana", 20, "white", "right");
			this.font.textBaseline = "bottom";
			//////////////////////////////////////////
			// LOADS THE MAIN MAP (DEBUG, WILL CHANGE)
            loadMap("VillageArea");
			me.game.sort();
			
			////////////////////////////////////////
			
			 //Destroying websockets event before create a new one	
			 jsApp.destroy("onListWorldVillage");
			 jsApp.destroy("onListUserVillages");
			 jsApp.destroy("onTransferSquads");
			 jsApp.destroy("onSquadTransferView");
			 jsApp.destroy("onVillageSelect");
			 jsApp.destroy("onListSquadAtk");
			 jsApp.destroy("onAtkVillage");
			 jsApp.destroy("onBuildingSelect");
             jsApp.destroy("onListVillageBuildings");
			 jsApp.destroy("onListVillageUnits");
			 jsApp.destroy("onRequestUpdate");
			 jsApp.destroy("onConstruct");
			 jsApp.destroy("onResourcesUpdate");
			 jsApp.destroy("onCheckUpdate");
			 jsApp.destroy("onConstructRequest");
			 jsApp.destroy("onConstructCheck");
			 jsApp.destroy("onRequestUnit");
			 jsApp.destroy("onUnitCheck");
			 jsApp.destroy("onListBuilding");
			 jsApp.destroy("onResourcesCollect");
			 jsApp.destroy("onSellMenu");	
			 jsApp.destroy("onOpenCreateSquad");
			 jsApp.destroy("onCreateSquad");
			 jsApp.destroy("onViewVillageSquad");
			 jsApp.destroy("onSquadDetail");
			 jsApp.destroy("onCreateOffer");
			 jsApp.destroy("onBuyMenu");
			 jsApp.destroy("onSellUnitMenu");
			 jsApp.destroy("onCreateUnitOffer");
			 jsApp.destroy("onBuyUnitMenu");
			 jsApp.destroy("onBuyUnitOffer");
			 jsApp.destroy("onSquadMergeView");
			 jsApp.destroy("onSquadMergeView2");
			 jsApp.destroy("onMergeSquad");
			 jsApp.destroy("onAlertTempleConquest");
			 jsApp.destroy("onCheckTempleTime");
			 jsApp.destroy("onAlertUserAtk");
			 jsApp.destroy("onAlertBuyResources");
			 jsApp.destroy("onAlertBuyUnit");
			 jsApp.destroy("onCheckVillageName");
			 jsApp.destroy("onAllocateUnitMenu");
			 jsApp.destroy("onAlocateUnit");
			 jsApp.destroy("onBuyOffer");
			 /////////////////////////////////////////
			
			
			//LISTING VILLAGE UNITS AND BUILDINGS
			socket.emit("onListVillageBuildings", this.idVillage);
			socket.emit("onListVillageUnits", {"idVillage" : this.idVillage});
			socket.emit("onCheckTempleTime");
			socket.emit("onCheckVillageName", { "userId" : userData.userId});
			
			///////////////////////
			//IF SOMEBODY BUY MY RESOURCE OFFER
			var AlertBuyRscFun = function(data){
				if(userData.userId == data.idUserOffert){
					alertify.success(data.Qtd+" units of "+data.offerDesc+" were sold!");
					//update resources hud
					jsApp.send("onResourcesUpdate", jsApp.getUserData());
				}
			}
			socket.on("onAlertBuyResources", AlertBuyRscFun);
			//////////////////////////////////

			///////////////////////
			//IF SOMEBODY BUY MY UNIT OFFER
			var AlertBuyUnitFun = function(data){
				if(userData.userId == data.idUserOffer){
					console.log(data.unitImg);
					var unitFace 	= data.unitImg.replace(" ","_");
					var unitFaceImg = me.loader.getImage(unitFace+"_Avatar");
					unitFace       	= $(unitFaceImg).attr("src");
					alertify.success("<img src='"+unitFace+"' /> "+data.unitDesc+" was sold!");
					
					//update resources hud
					jsApp.send("onResourcesUpdate", jsApp.getUserData());
				}
			}
			socket.on("onAlertBuyUnit", AlertBuyUnitFun);
			//////////////////////////////////

			
			//////////////////////////
			//IF IM BEING ATTACKED //
			var AlertAtkFun = function(data){
				//if im the user being attacked
				if(userData.userId == data.idUser){
					me.game.remove(this, true);
					me.state.change(me.state.OUTWORLD);
					alertify.confirm(data.Msg);
				}
			}
			socket.on("onAlertUserAtk", AlertAtkFun);
			////////////////////////
			
			/////////////////////////////////
			//IF THE TEMPLE WAS DOMINATED //
			var AlertTempleFun = function(rows){
				if(rows[0][0] != undefined){
					if(rows[0][0].Msg != null ){
						if(this.templeTime != undefined){ me.game.remove(this.templeTime); }
						var userTempleId   = rows[0][0].idUser;
						var userTempleNick = rows[0][0].Nick;
						alert("The Temple Was Dominated by "+userTempleNick+"! Time it's running out");
						var time = rows[0][0].Msg;
						this.templeTime = new jsApp.TempleTimeOut(time);// creating a new instance of the class TempleTimeOut
						me.game.add(this.templeTime,10);
						me.game.sort();
					}
				}
			}
			socket.on("onAlertTempleConquest", AlertTempleFun);
			////////////////////////
			
			/////////////////////////////////
			//IF THE TEMPLE STILL DOMINATED //
			var timeTempleFun = function(rows){
				if(rows[0][0] != undefined){
					if(rows[0][0].Msg != null ){
						if(rows[0][0].Msg != "Timeout" && rows[0][0].Msg != "00:00:00"){
							if(this.templeTime != undefined){ me.game.remove(this.templeTime); }
							var userTempleId   = rows[0][0].idUser;
							var userTempleNick = rows[0][0].Nick;
							if(userData.newLogin == undefined){
								if(userTempleId == userData.userId){
									alertify.success("The Temple Still Dominated by you!");
								}else{
									alertify.error("The Temple Still Dominated by "+userTempleNick);
								}
								userData.newLogin = false;
							}
							var time = rows[0][0].Msg;
							this.templeTime = new jsApp.TempleTimeOut(time);// creating a new instance of the class TempleTimeOut
							me.game.add(this.templeTime,10);
							me.game.sort();
						}
					}
				}
			}
			socket.on("onCheckTempleTime", timeTempleFun);
			////////////////////////
			
			///////////////////////
			//GETTING THIS VILLAGE NAME
			var villageNameFun = function(rows){
				$.each(rows[0], function(i, obj) {
					var village = rows[0][i];
					if(userData.idVillage == village.idVillage){
						this.gui = new jsApp.ActionMenu("Village", village.VillageNick);
						me.game.add(this.gui, 1000);
						me.game.sort();
					}
				});
			}
			socket.on("onCheckVillageName", villageNameFun);
			//////////////////////////////////
            //HERE WE VERIFY THE BUILDINGS OF THE VILLAGE AND THEIR POSITION
			var listVillageBldFun = function(data){
                var buildLayer =  me.game.currentLevel.getLayerByName("Transp");//getting the correct map layer to tile changes
                //console.log(data[0]);
				for (var i in data[0]){
                    if (i!="remove"){
                        var idTile  = data[0][i].idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
                        var x       = data[0][i].posX;
                        var y       = data[0][i].posY;
                        var pending = data[0][i].pending;
						var timer   = data[0][i].Timer;
						var type    = data[0][i].Type;
						var idVillage = jsApp.getUserData().idVillage;
						if(timer == null){ timer = "00:00:00";}
						//if the construction still pending, add a new progress bar and a timeScheduler event//
                        if(pending == "Y"){
							//if it's traning a unit or doing upgrade
							if(data[0][i].JobDescription != undefined){
								var unitDetails = {"buildingX" : x, "buildingY" : y, "idVillage" : idVillage, "Description" : data[0][i].JobDescription};
								socket.emit("onUnitCheck",unitDetails);
							}else{
								idTile   	   = 37;
								changeTile     = data[0][i].idTile + 1;
								time    	   = jsApp.timeToMs(timer);
								pixelIs 	   = jsApp.getTileForPixels(x,y);
								socket.emit("onConstructCheck",{"x" : x, "y" : y, "idVillage" : idVillage, "idTile" : changeTile});
							}
                        }
						//IF IT'S A COLLECTOR 
						if(type == "R"){
							//console.log(data[0][i]);
							var gatherTime = jsApp.timeToMs(data[0][i].TimerColection);
							pixelIs 	   = jsApp.getTileForPixels(x,y);
							socket.emit("onResourcesCollect",{"idVillage": idVillage, "x" : x, "y" : y, "gatherTime" : gatherTime, "type" : idTile}) // --> Need to start the resource collect engine
						}
                        buildLayer.setTile(x,y,idTile);//changing the tile
                    }
                }
            }
            socket.on("onListVillageBuildings", listVillageBldFun);
			//////////////////////////////////////////////////////////
			
						
            //PLACING UNITS THE PLAYER HAS ON THE MAP
			var listVillageUnitsFun = function(data){
                var unitList = data[0];
                var classList = data[1];
                if(data[2]=="openMenu") {
                    gameHandler.activeHuds.villageUnitsGeneral = new jsApp.VillageUnitsGeneral(unitList, classList);
                    gameHandler.activeHuds.villageUnitsGeneral.listUnits = unitList;
                    gameHandler.activeHuds.villageUnitsGeneral.listClasses = classList;
                    me.game.add(gameHandler.activeHuds.villageUnitsGeneral, 1100);
                    me.game.sort();
                }else{
                    var unit = unitList.length;
                    while(unit--) {
                        var thisUnit = unitList[unit];
                        var pos = jsApp.getRandomPointInScreen();
                        var piece = new Unit(pos.x , pos.y , thisUnit);
                        me.game.add(piece, 10);
						me.game.sort();
                    }
                }
            }
            socket.on("onListVillageUnits", listVillageUnitsFun);
			/////////////////////////////////////////////////////

			 //HERE WE SEND THE UPDATE REQUEST
			 var rqstUpdateFun = function(rows, data){
				var infobuild = data;
				if(rows[0][0].Msg == "Done"){
					var time 	   = jsApp.timeToMs(infobuild.buildTimer);
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile 	   = 37; // NEED TO SEE THIS BETTER VERY QUICK!
                    var pixelIs    = jsApp.getTileForPixels(infobuild.posX,infobuild.posY);
					infobuild.x    = infobuild.posX;
					infobuild.y    = infobuild.posY;
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
					//updating the resources
					jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
					//
					this.progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class Timer
					var checkUpdate = function(){ socket.emit("onCheckUpdate",infobuild);};
					me.game.add(this.progressBar,10);// adding this to the screen
                    jsApp.timeScheduler(checkUpdate,time);// sending the construction to the scheduler.
				}else{
					alert(rows[0][0].Msg);
				}
                me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                gameHandler.activeHuds.buildingHUD = undefined;
                me.game.sort();
			 }
			 socket.on("onRequestUpdate", rqstUpdateFun);
			////////////////////////////////////////////////////
			
			 ///////////////////////////////////////////
			 //CHECKING IF THE UPDATE ALREADY IS DONE
			 var checkUpdateFun = function(rows, data){
				var infobuild = data;
				if(rows[0][0].Msg == "Done"){
					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var idTile 	   = infobuild.idTile + 1; // NEED TO SEE THIS BETTER VERY QUICK!
					buildLayer.setTile(infobuild.posX,infobuild.posY,idTile);//changing the tile
				}else{
					alert(rows[0][0].Msg);
				}
			 }
			 socket.on("onCheckUpdate", checkUpdateFun);
			 //////////////////////////////////////////


             //HERE WE VERIFY IF THE CLICK RESULTS IN A BUILDING AND GET ALL THE DATA TO BUILD THE BUILDING HUD!
			 var bldSelectFun = function(rows,data) {
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(gameHandler.activeHuds.buildingHUD==undefined) {

							//THIS WILL DO UNTIL WE FIX IT RIGHT
							if(obj[i].posX == undefined){obj[i].posX = data.X}
							if(obj[i].posY == undefined){obj[i].posY = data.Y}
							//
							gameHandler.activeHuds.buildingHUD 			 = new jsApp.BuildingHUD(obj[i],data);
							gameHandler.activeHuds.buildingHUD.idVillage = this.idVillage; 	
							me.game.add(gameHandler.activeHuds.buildingHUD, 1100);
							me.game.sort();
						}
					}
				});
			}
			 socket.on('onBuildingSelect', bldSelectFun);
			//

			//////////////////////////////////////////
			//Request Construction//
			//
			var constructRqstFun = function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg != "Done"){
							alert(obj[i].Msg);
						}else{
							var building = data;
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							var time = jsApp.timeToMs(data.buildTimer);
                            var pixelIs = jsApp.getTileForPixels(building.x,building.y);
							
							buildLayer.setTile(building.x,building.y,37);//changing the tile for the construction zone
							this.progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							me.game.add(this.progressBar,10);// adding this to the screen
							var vconstructCheck = function(){socket.emit("onConstructCheck",data);};
							jsApp.timeScheduler(vconstructCheck,time);// sending the construction to the scheduler.

							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData()); //

							me.game.remove(gameHandler.activeHuds.buildingArea,true);// removing the hud layer of the construction
							gameHandler.activeHuds.buildingArea = undefined;
							me.game.sort();
						}
					}

				});
			}
			socket.on("onConstructRequest", constructRqstFun);
			//////////////////////////////////////////
			
			//////////////////////////////////////////
			//constructing and updating resourcesHUD//
			//
			var contruckChkFun = function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg == "Done"){
							var building  = data;
							var idTile    = building.idTile; 
							var userData  = jsApp.getUserData();
							var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
							buildLayer.setTile(building.x,building.y,idTile);//changing the tile
							//IF IT'S A COLLECTOR --> NEED TO SEE THIS BETTER
							if(building.Type == "R"){
								var gatherTime     = jsApp.timeToMs(building.gatherTime);
								var pixelIs 	   = jsApp.getTileForPixels(building.x,building.y);
								var resourceColect = function(){socket.emit("onResourcesCollect",{"idVillage": userData.idVillage, "x" : building.x, "y" : building.y, "gatherTime" : gatherTime, "type" : idTile})};
								jsApp.timeScheduler(resourceColect,gatherTime);
							}
							
						}else{
							var building 	   = data;
							var time    	   = jsApp.timeToMs(obj[i].Msg);
							var idTile 		   = building.idTile;
							var pixelIs 	   = jsApp.getTileForPixels(building.x,building.y);
							this.progressBar    = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							var constructCheck = function(){socket.emit("onConstructCheck",{"x" : building.x, "y" : building.y, "idVillage" : building.idVillage, "idTile" : idTile});};
							me.game.add(this.progressBar,10);// adding this to the screen
							jsApp.timeScheduler(constructCheck,time);// sending the construction to the scheduler.
							me.game.sort();
						}
					}

				});
			}
			socket.on("onConstructCheck", contruckChkFun);
			////////////////////////////////////
						
			////////////////////////////////////////////////////////////////
			//Creating Units
			//
			var rqstUnitFun = function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg != "Done"){
						alert(obj[i].Msg);
						}else{
							var unitInfo = data;
							var time = jsApp.timeToMs(obj[i].Timer);
							var pixelIs = jsApp.getTileForPixels(unitInfo.buildingX,unitInfo.buildingY);
							this.progressBar = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							me.game.add(this.progressBar,10);// adding this to the screen
							var unitCheck = function(){socket.emit("onUnitCheck",data);};
							jsApp.timeScheduler(unitCheck,time);// sending the construction to the scheduler.

							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData()); //
							
							me.game.remove(gameHandler.activeHuds.unitMenu);
							me.game.sort();
						}
					}
				});
			}
			socket.on("onRequestUnit", rqstUnitFun);
			

			/////////////////////////////////////////////
			//checking if the unit it's already done
			var unitChkFun = function(rows, data){
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg == "Done"){
							// Aqui pra criar o carinha , onde tiver a casa que criou
							// a casa que criou ta no this.building
							var pixelIs = jsApp.getTileForPixels(data.buildingX, data.buildingY);
							var piece   = new Unit(pixelIs.x,pixelIs.y, data);
							me.game.add(piece, 10);
							me.game.sort();
						}else{
							var unit 	       = data;
							var time    	   = jsApp.timeToMs(obj[i].Msg);
							var pixelIs 	   = jsApp.getTileForPixels(unit.buildingX, unit.buildingY);
							this.progressBar   = new jsApp.ProgressBar(time,pixelIs);// creating a new instance of the class ProgressBar
							var unitCheck      = function(){socket.emit("onUnitCheck",unit);};
							me.game.add(this.progressBar,10);// adding this to the screen
							jsApp.timeScheduler(unitCheck,time);// sending the construction to the scheduler.
							me.game.sort();
						}
					}
				});
			}
			socket.on("onUnitCheck", unitChkFun);
			///////////////////////////////////////////////

			//creating the window to create the squad
			var onOpenAllocateUnitFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogAllocateUnit");
				div.setAttribute("name","dialogAllocateUnit");
				div.setAttribute("title","Allocate Units to Collect ( max: 5)");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogAllocateUnit" ).dialog({
					autoOpen: false,
					height: 500,
					width: 450,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").attr("checked",true);
						},
						"Send": function() {
							var idUnits   = "";
							$("input:checkbox:checked").each(function(i, obj){
								idUnits = idUnits + $(this).val()+",";
							});
							if(idUnits.length != 0){
								//clearing the last char
								idUnits = idUnits.substring(0,(idUnits.length - 1));
								
								//sending to the server
								socket.emit("onAlocateUnit",{"idUnits" : idUnits, "idBuilding" : data.idBuilding});
								
								//clearing the form
								$( "#dialogAllocateUnit" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No unit was selected!');
							}
						},
						Cancel: function() {
							$( "#dialogAllocateUnit" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
					}
				});

				//////////////////////////////////
				//POPULATING THE ARMY CHECKBOXES
				var allocateUnitContent = "";
				allocateUnitContent     = allocateUnitContent + "<table boder=0 width=100%><tr>";
				allocateUnitContent 	= allocateUnitContent + "<td align='left' width=30%><b>UNIT</b></td>";
				allocateUnitContent 	= allocateUnitContent + "<td align='left' width=70%><b>ATTRIBUTES</b></td>";
				allocateUnitContent 	= allocateUnitContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						allocateUnitContent = allocateUnitContent + "<br><center>" + rows[0][i].Msg + "</center>";
					}else{
						var unit 		   = rows[0][i];
						var imgStr 		   = unit.Description.replace(" ","_");
						
						var unitFace       = me.loader.getImage(imgStr+"_Avatar");
						unitFace       	   = $(unitFace).attr("src");
						
						var lifeImg        = me.loader.getImage("Life");
						lifeImg       	   = $(lifeImg).attr("src");
						
						var atkImg         = me.loader.getImage("Sword");
						atkImg       	   = $(atkImg).attr("src");
						
						var defImg         = me.loader.getImage("Shield");
						defImg			   = $(defImg).attr("src");
						
						var allocateCheckBox   = "<tr onclick='onClickSelection(this,"+'"checkbox"'+");' style='cursor:pointer'><td width=30% align=left><input type='checkbox' name='squadUnit' value='"+unit.idArmy+"'><img src='"+unitFace+"' /></input>"+unit.Unit_Name+"("+unit.Description+") </td>";
						allocateCheckBox       = allocateCheckBox + "<td width=70% align=left ><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br><img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</td></tr>";
						allocateCheckBox       = allocateCheckBox + "<tr><td></td><td width=70% align=left><img src='data/sprite/division.png' width=60% height=60%/></td></tr>";
						allocateUnitContent    = allocateUnitContent + allocateCheckBox;
					}
				});
				
				$("#dialogAllocateUnit").append(allocateUnitContent);
				$("#dialogAllocateUnit").dialog( "open" );
			}
			socket.on("onAllocateUnitMenu", onOpenAllocateUnitFun);
			///////////////////////////////////////////////			
			
			 ///////////////////////////////////////////
			 //CHECKING IF THE UPDATE ALREADY IS DONE
			 var onAlocateUnitFun = function(rows, data){
				console.log(rows);
				if(rows[0][0].Msg != "Done"){
					alertify.error(rows[0][0].Msg);
				}else{
					alertify.success('Units Was Allocated!');
				}
			 }
			 socket.on("onAlocateUnit", onAlocateUnitFun);
			 //////////////////////////////////////////
			

			//creating the window to create the squad
			var openSquadFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var idVillage = data;
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogArmy");
				div.setAttribute("name","dialogArmy");
				div.setAttribute("title","Create Squad");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogArmy" ).dialog({
					autoOpen: false,
					height: 580,
					width: 450,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").attr("checked",true);
						},
						"Send": function() {
							//creating the new squad
							var squadName = $("#squadName").val();
							if(squadName == "" || squadName == null){
								alert('Please, give a name to the squad!');
							}else{
								var idUnits   = "";
								$("input:checkbox:checked").each(function(i, obj){
									idUnits = idUnits + $(this).val()+",";
								});
								if(idUnits.length != 0){
									//clearing the last char
									idUnits = idUnits.substring(0,(idUnits.length - 1));
									
									//sending to the server
									socket.emit("onCreateSquad",{"idVillage" : idVillage, "squadName" : squadName, "idUnits" :  idUnits});
									
									//clearing the form
									$( "#dialogArmy" ).html('');
									$( this ).dialog( "close" );
								}else{
									alert('No unit was selected!');
								}

							}
						},
						Cancel: function() {
							$( "#dialogArmy" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
					}
				});

				//////////////////////////////////
				//POPULATING THE ARMY CHECKBOXES
				var squadContent = "<center><b>Squad Name:</b> <input type='text' name='squadName' id='squadName' length='20'></input></center><br><br>";
				squadContent     = squadContent + "<table boder=0 width=100%><tr>";
				squadContent 	 = squadContent + "<td align='left' width=30%><b>UNIT</b></td>";
				squadContent 	 = squadContent + "<td align='left' width=70%><b>ATTRIBUTES</b></td>";
				squadContent 	 = squadContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						squadContent = squadContent + "<br><center>" + rows[0][i].Msg + "</center>";
					}else{
						var unit 		   = rows[0][i];
						var imgStr 		   = unit.Description.replace(" ","_");
						
						var unitFace       = me.loader.getImage(imgStr+"_Avatar");
						unitFace       	   = $(unitFace).attr("src");
						
						var lifeImg        = me.loader.getImage("Life");
						lifeImg       	   = $(lifeImg).attr("src");
						
						var atkImg         = me.loader.getImage("Sword");
						atkImg       	   = $(atkImg).attr("src");
						
						var defImg         = me.loader.getImage("Shield");
						defImg			   = $(defImg).attr("src");
						
						var unitCheckBox   = "<tr onclick='onClickSelection(this,"+'"checkbox"'+");' style='cursor:pointer'><td width=30% align=left><input type='checkbox' name='squadUnit' value='"+unit.idArmy+"'><img src='"+unitFace+"' /></input>"+unit.Unit_Name+"("+unit.Description+") </td>";
						unitCheckBox       = unitCheckBox + "<td width=70% align=left ><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br><img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</td></tr>";
						unitCheckBox       = unitCheckBox + "<tr><td></td><td width=70% align=left><img src='data/sprite/division.png' width=60% height=60%/></td></tr>";
						squadContent 	   = squadContent + unitCheckBox;
					}
				});
				
				$("#dialogArmy").append(squadContent);
				$( "#dialogArmy" ).dialog( "open" );
			}
			socket.on("onOpenCreateSquad", openSquadFun);
			///////////////////////////////////////////////
			
			///////////////////////
			//WHEN I CREATE A SQUAD
			var createSquadFun = function(rows, data){
				if(rows[0][0].Msg != "Done"){
					alertify.error(rows[0][0].Msg);
				}else{
					alertify.success('The Squad "'+data.squadName+'" was created!');
				}
			}
			socket.on("onCreateSquad", createSquadFun);
			//////////////////////////////////			
			
			///////////////////////////////////////////////
			//creating the window to view the village squads
			var viewSquadFun = function(rows, data){

				//////////////////////////
				//CREATING THE MODAL FORM
				var idVillage 	   = data;
				var div 	  	   = document.createElement("div");
				var squadFunction  = "<script>function showSquadDetail(idSquad,squadName){socket.emit('onSquadDetail',idSquad,squadName);$('#dialogSquad').dialog('close');$('#dialogSquad').html('');}</script>";
				div.setAttribute("id","dialogSquad");
				div.setAttribute("name","dialogSquad");
				div.setAttribute("title","View Squad");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$("#dialogSquad").append(squadFunction);
				$( "#dialogSquad" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {

					},
					close: function() {
						$("#dialogSquad").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUADS LINK
				var villageSquadContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][0].Msg != undefined){
						villageSquadContent = villageSquadContent + "<br>" +rows[0][0].Msg;
					}else{
						var squad 		    = rows[0][i];
						var villageSquad    = "<br> <a   href='#' name='squad_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' onclick='javascript:showSquadDetail("+squad.idSquadVillage+","+'"'+squad.SquadName+'"'+");'>"+squad.SquadName+"</a>";
						villageSquadContent = villageSquadContent + villageSquad;
					}
				});
				
				$("#dialogSquad").append(villageSquadContent);
				$( "#dialogSquad" ).dialog( "open" );
			}
			socket.on("onViewVillageSquad", viewSquadFun);
			
			///////////////////////////////////////////////
			//creating the window to view the squad detail
			var squadDetailFun = function(rows, idSquad,squadName){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
				div.setAttribute("id","dialogSquadUnits");
				div.setAttribute("name","dialogSquadUnits");
				div.setAttribute("title",squadName);
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$("#dialogSquadUnits").dialog({
					autoOpen: false,
					height: 480,
					title: squadName,
					width: 600,
					modal: true,
					buttons: {

					},
					close: function() {
						$("#dialogSquadUnits").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE ARMY LIST
				var unitSquadContent = "";
				$.each(rows[0], function(i, obj) {
					var unit 		 = rows[0][i];
					var imgStr       = unit.Description.replace(" ","_");
					var unitImg      = me.loader.getImage(imgStr+"_Front");
					unitImg       	 = $(unitImg).attr("src");
					var unitSquad = "<br> "+unit.qty+" X "+unit.Description + " <img src='"+unitImg+"' />";
					unitSquadContent = unitSquadContent + unitSquad;
				});
				
				$("#dialogSquadUnits").append(unitSquadContent);
				$( "#dialogSquadUnits" ).dialog( "open" );
			}
			socket.on("onSquadDetail", squadDetailFun);
			//////////////////////////////////////////////////////////////
			
			///////////////////////////////////////////////
			//creating the window to view the user squads
			var transferSquadFun = function(rows){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
	
				div.setAttribute("id","dialogTransferSquad");
				div.setAttribute("name","dialogTransferSquad");
				div.setAttribute("title","Select the Squad you want to swap between your Villages");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogTransferSquad" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").attr("checked",true);
						},
						"Next" : function(){
							var idSquads   = "";
							$("input:checkbox:checked").each(function(i, obj){
								idSquads = idSquads + $(this).val()+",";
							});
							if(idSquads.length != 0){
								//clearing the last char
								idSquads = idSquads.substring(0,(idSquads.length - 1));
								
								//sending to the server to list the villages to transfer
								socket.emit("onListUserVillages",{"idSquads" : idSquads, "userId" : userData.userId});
								
								//clearing the form
								$( "#dialogArmy" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Squad was selected!');
							}

						},
						Cancel: function() {
							$( "#dialogTransferSquad" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogTransferSquad").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUADS LINK
				var userSquadContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][0].Msg != undefined){
						userSquadContent = userSquadContent + "<br>" +rows[0][0].Msg;
					}else{
						var squad 		    = rows[0][i];
						var userSquad    = "<br> <input style='cursor:pointer' type='checkbox' name='transferSquadCbx' id='transferSquadCbx_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' />"+squad.SquadName;
						userSquadContent = userSquadContent + userSquad;
					}
				});
				
				$("#dialogTransferSquad").append(userSquadContent);
				$( "#dialogTransferSquad" ).dialog( "open" );
			}
			socket.on("onSquadTransferView", transferSquadFun);			
			/////////////////////////////////////////////////////////////
			
			///////////////////////////////////////////////
			//creating the window to view the user villages
			var viewVillagesFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
	
				div.setAttribute("id","dialogTransferVillage");
				div.setAttribute("name","dialogTransferVillage");
				div.setAttribute("title","Select the Village you want to swap the Squads :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogTransferVillage" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Send" : function(){
							var idVillageTransf   = "";
							$("input:radio:checked").each(function(i, obj){
								idVillageTransf = $(this).val();
							});
							
							if(idVillageTransf.length != 0){
								//sending to the server to list the villages to transfer
								socket.emit("onTransferSquads",{"idSquads" : data.idSquads, "idVillageTransf" : idVillageTransf});
								//clearing the form
								$( "#dialogTransferVillage" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Village was selected!');
							}
						},
						Cancel: function() {
							$( "#dialogTransferVillage" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogTransferVillage").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUADS LINK
				var villageTransfContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][0].Msg != undefined){
						villageTransfContent = villageTransfContent + "<br>" +rows[0][0].Msg;
					}else{
						var village 		 = rows[0][i];
						var isTemple		 = village.VillageNick.indexOf('Temple');
						if(isTemple != -1){ var img = 'data/sprite/temple_icon.png';}else{ var img = 'data/sprite/village_icon.png';}
						var villageSquad     = "<br> <input style='cursor:pointer' type='radio' name='transferVillage' id='transferVillage_"+village.idVillage+"' value='"+village.idVillage+"' /> "+village.VillageNick+" <img src='"+img+"' width='32' height='32'/>";
						villageTransfContent = villageTransfContent + villageSquad;
					}
				});
				
				$("#dialogTransferVillage").append(villageTransfContent);
				$( "#dialogTransferVillage" ).dialog( "open" );
			}
			socket.on("onListUserVillages", viewVillagesFun);			
			/////////////////////////////////////////////////////////////	
			
			///////////////////////////////////////////
			//AFTER THE TRANSF IT'S DONE
			 var transfCheckFun = function(rows, data){
				alertify.confirm(rows[0][0].Msg);
				me.state.change(me.state.PLAY); //to redraw the units in the screen
			 }
			 socket.on("onTransferSquads", transfCheckFun);
			 //////////////////////////////////////////
			

			///////////////////////////////////////////////
			//creating the window to view the user squads
			var mergeSquadViewFun = function(rows){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogMergeSquad");
				div.setAttribute("name","dialogMergeSquad");
				div.setAttribute("title","Select the units you want to move between your Squads");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogMergeSquad" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").attr("checked",true);
						},
						"Next": function() {
							var idUnits   = "";
							$("input:checkbox:checked").each(function(i, obj){
								idUnits = idUnits + $(this).val()+",";
							});

							if(idUnits.length != 0){
								//clearing the last char
								idUnits = idUnits.substring(0,(idUnits.length - 1));
								//sending to the server
								socket.emit("onSquadMergeView2",{"userId" : userData.userId, "idUnits" :  idUnits});
								
								//clearing the form
								$( "#dialogMergeSquad" ).html('');
								$( this ).dialog( "close" );									
							}else{
								alert('No unit was selected!');
							}
						},
						Cancel: function() {
							$( "#dialogMergeSquad" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
					}
				});

				//////////////////////////////////
				//POPULATING THE ARMY CHECKBOXES
				var squadContent = "";
				squadContent     = squadContent + "<table boder=0 width=100%><tr>";
				squadContent 	 = squadContent + "<td align='center' width=50%><b>UNIT</b></td>";
				squadContent 	 = squadContent + "<td align='center' width=20%><b>ATTRIBUTES</b></td>";
				squadContent 	 = squadContent + "<td align='center' width=30%><b>SQUAD</b></td>";
				squadContent 	 = squadContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						squadContent = squadContent + "<br>" + rows[0][i].Msg;
					}else{
						var unit 		   = rows[0][i];
						var imgStr 		   = unit.Description.replace(" ","_");
						
						var unitFace       = me.loader.getImage(imgStr+"_Avatar");
						unitFace       	   = $(unitFace).attr("src");
						
						var lifeImg        = me.loader.getImage("Life");
						lifeImg       	   = $(lifeImg).attr("src");
						
						var atkImg         = me.loader.getImage("Sword");
						atkImg       	   = $(atkImg).attr("src");
						
						var defImg         = me.loader.getImage("Shield");
						defImg			   = $(defImg).attr("src");
						
						var unitCheckBox   = "<tr style='cursor:pointer' onclick='onClickSelection(this,"+'"checkbox"'+");'><td width=50% align=left><input type='checkbox' name='squadUnit' value='"+unit.idArmy+"'><img src='"+unitFace+"' /></input>"+unit.Unit_Name+"("+unit.Description+") </td>";
						unitCheckBox       = unitCheckBox + "<td width=20% align=center ><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br><img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</td>";
						unitCheckBox       = unitCheckBox + "<td width=30% align=center >"+unit.SquadName+"</td></tr>"
						unitCheckBox       = unitCheckBox + "<tr><td></td><td align=right><img src='data/sprite/division.png' width=60% height=60%/></td><td></td></tr>";
						squadContent 	   = squadContent + unitCheckBox;
					}
				});
				
				$("#dialogMergeSquad").append(squadContent);
				$( "#dialogMergeSquad" ).dialog( "open" );
			}
			socket.on("onSquadMergeView", mergeSquadViewFun);			
			/////////////////////////////////////////////////////////////
			
			///////////////////////////////////////////////
			//creating the window to view the user villages
			var viewSelectSquadFun = function(rows, data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  	   = document.createElement("div");
	
				div.setAttribute("id","dialogSelectSquadMerge");
				div.setAttribute("name","dialogSelectSquadMerge");
				div.setAttribute("title","Select the Squad you want to receive the units");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				$( "#dialogSelectSquadMerge" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Send" : function(){
							var idSquadTransf   = "";
							$("input:radio:checked").each(function(i, obj){
								idSquadTransf = $(this).val();
							});
							
							if(idSquadTransf.length != 0){
								//sending to the server to list the villages to transfer
								console.log(data.idUnits);
								console.log(idSquadTransf);
								socket.emit("onMergeSquad",{"idUnits" : data.idUnits, "idSquadTransf" : idSquadTransf});
								//clearing the form
								$( "#dialogSelectSquadMerge" ).html('');
								$( this ).dialog( "close" );
							}else{
								alert('No Squad was selected!');
							}
						},
						Cancel: function() {
							$( "#dialogSelectSquadMerge" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogSelectSquadMerge").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE SQUADS LINK
				var userSquadContent = "";
				$.each(rows[0], function(i, obj) {
					if(rows[0][0].Msg != undefined){
						userSquadContent = userSquadContent + "<br>" +rows[0][0].Msg;
					}else{
						var squad 		 = rows[0][i];
						var userSquad    = "<br> <input style='cursor:pointer' type='radio' name='transferSquadCbx' id='transferSquadCbx_"+squad.idSquadVillage+"' value='"+squad.idSquadVillage+"' />"+squad.SquadName;
						userSquadContent = userSquadContent + userSquad;
					}
				});
				
				$("#dialogSelectSquadMerge").append(userSquadContent);
				$( "#dialogSelectSquadMerge" ).dialog( "open" );
			}		
			 socket.on("onSquadMergeView2", viewSelectSquadFun);
			/////////////////////////////////////////////////////////////	
			
			///////////////////////////////////////////
			//AFTER THE MERGE IT'S DONE
			 var mergeCheckFun = function(rows, data){
				alertify.confirm(rows[0][0].Msg);
				me.state.change(me.state.PLAY); //to redraw the units in the screen
			}
			 socket.on("onMergeSquad", mergeCheckFun);
			 //////////////////////////////////////////
			 
            ///////////////////////
            // LISTING BUILDINGS //
            ///////////////////////
			var bldList = new Array();
			var listBldFun = function(data){
				//////////////////////////
				//CREATING THE MODAL FORM
				var div		 = document.createElement("div");
				div.setAttribute("id","dialogBuild");
				div.setAttribute("name","dialogBuild");
				div.setAttribute("title","Select a building:");
				div.setAttribute("style","display:none");

				$("body").append(div);
				$( "#dialogBuild" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Build" : function(){
							//ADD THE GAME HUD TO PLAYER SELECT WHERE TO BUILD
							$("input:radio[name*='bldSelect']:checked").each(function(i, obj){
								var idBld   = $(this).val();
								var bldArea = new jsApp.BuildArea("mousedown",bldList[idBld]);// creating a new instance of the class BuildArea
                                me.game.add(bldArea,1000);// adding this to the screen
								me.game.sort();
							});
							
							$( "#dialogBuild" ).html('');
							$( this ).dialog( "close" );
						},
						
						Cancel: function() {
							$( "#dialogBuild" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						$("#dialogBuild").html('');
					}
				});
				
				//////////////////////////////////
				//POPULATING THE BUILDING MENU
				var buildContent = "<table boder=0 width=100%><tr>";
				buildContent 	 = buildContent + "<td align='center' width=20%><b>BUILDING</b></td>";
				buildContent 	 = buildContent + "<td align='center' width=40%><b>RESOURCES</b></td>";
				buildContent 	 = buildContent + "<td align='center' width=40%></td>";
				buildContent 	 = buildContent + "</tr>";
				
				$.each(data[0], function(i, obj) {
					var build 	 = data[0][i];
					bldList[build.idBuilding] = new Array();
					bldList[build.idBuilding] = build;
					
					var imgStr 		   		  = build.Description.replace(" ","_");
					var bdlImg      		  = me.loader.getImage(imgStr);
					bdlImg       	   		  = $(bdlImg).attr("src");

					var bldDetail  = ""; 			 //
					bldDetail  	   = bldDetail + "<tr title='"+'<b>'+build.Obs+'</b>'+"' onclick='onClickSelection(this,"+'"radio"'+");toolTip(this);' style='cursor:pointer'><td width=20%><b>"+build.Description+"</b><p><br><input type='radio' name='bldSelect' value='"+build.idBuilding+"' ><img src='"+bdlImg+"' /></input></p></td>";
					bldDetail  	   = bldDetail + "<td width=40% align='center'>";
					
					//PLEASE,FIX ME 
					if((build.gold != undefined) && (build.gold != 0)){
						var img   = me.loader.getImage('Gold');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.gold+"</p>";
					}
					if((build.wood != undefined) && (build.wood != 0)){
						var img   = me.loader.getImage('Wood');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.wood+"</p>";
					}
					if((build.iron != undefined) && (build.iron != 0)){
						var img   = me.loader.getImage('Iron');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.iron+"</p>";					
					}
					if((build.stone != undefined) && (build.stone != 0)){
						var img   = me.loader.getImage('Stone');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.stone+"</p>";	
					}
					if((build.food != undefined) && (build.food != 0)){
						var img   = me.loader.getImage('Food');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.food+"</p>";
					}
					
					bldDetail  = bldDetail + "</td><td width=40%>";
					
					if(build.buildTimer != undefined){
						var img   = me.loader.getImage('Clock');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.buildTimer+"</p>";						
					}
					if((build.gatherTime != undefined) && (build.gatherTime != '00:00:00')){
						var img   = me.loader.getImage('Hammer');
						img       = $(img).attr("src");
						bldDetail = bldDetail + "<p><img src='"+img+"'/>"+build.gatherTime+"</p>";						
					}
					
					bldDetail  = bldDetail + "</td></tr><tr><td width=20%></td><td width=60% align=center><img src='data/sprite/division.png' width=50% height=50%/></td><td width=20%></td></tr>";
					
					buildContent = buildContent + bldDetail;
				});
				buildContent = buildContent + "</table>";
				$("#dialogBuild").append(buildContent);
				$("#dialogBuild").dialog("open");
				
            }
            socket.on("onListBuilding", listBldFun);			
			//////////////////////////////////////////
			
			///////////////////////////////////////
			//getting the resources by websockets//
			var resourceUpdateFun = function(data) {
				$.each(data, function(i, obj) {
					if(i>0)
						return false;
					else{
						gameHandler.activeHuds["resourceHud"].WoodValue  = obj[i].wood;
						gameHandler.activeHuds["resourceHud"].StoneValue = obj[i].stone;
						gameHandler.activeHuds["resourceHud"].FoodValue  = obj[i].food;
						gameHandler.activeHuds["resourceHud"].IronValue  = obj[i].iron;
						gameHandler.activeHuds["resourceHud"].GoldValue  = obj[i].gold;
					}
				});
			}
			socket.on('onResourcesUpdate', resourceUpdateFun);
			/////////////////////////////////////////

			///////////////////////////////////////
			//collecting the resources			//
			var resourceCltFun = function(rows, data) {
				$.each(rows, function(i, obj) {
					if(i>0)
						return false;
					else{
						if(obj[i].Msg == "Done"){
							//updating the resources
							jsApp.send("onResourcesUpdate", jsApp.getUserData());
							//
							var userData       = jsApp.getUserData();
							var pixelIs 	   = jsApp.getTileForPixels(data.x,data.y);
							var ColectAlert    = new jsApp.ColectAlert(pixelIs, data.type, obj[i].Qtd);
							var resourceColect = function(){socket.emit("onResourcesCollect",{"idVillage": data.idVillage, "x" : data.x, "y" : data.y, "gatherTime" : data.gatherTime, "type" : data.type})};
							me.game.add(ColectAlert,10); 
							jsApp.timeScheduler(resourceColect,data.gatherTime);	
							me.game.sort();							
						}else{
							// if anyone try to hack, this will add a new time until the update it's done.
							var remainingTime  = jsApp.timeToMs(obj[i].Msg);
							var pixelIs 	   = jsApp.getTileForPixels(data.x,data.y);
							var resourceColect = function(){socket.emit("onResourcesCollect",{"idVillage": data.idVillage, "x" : data.x, "y" : data.y, "gatherTime" : data.gatherTime, "type" : data.type})};
							jsApp.timeScheduler(resourceColect,remainingTime);
						}
					}
				});
			}
			socket.on('onResourcesCollect', resourceCltFun);
			/////////////////////////////////////////

			///////////////////////////////////////
			//Opening sell menu					//
			////						/////////
			var sellMenuFun = function(rows) {
				//////////////////////////
				//CREATING THE MODAL FORM
				var userData  = jsApp.getUserData();
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogSell");
				div.setAttribute("name","dialogSell");
				div.setAttribute("title","Select what you want to sell :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogSell" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Send": function() {
							//creating new market offer
							$.each(rows[0], function(i, obj) {
								var resource = rows[0][i];
								if(resource.Description == "gold"){
								}else{
									//if it's a valid number, send to the server
									if( (($("#"+resource.Description+"_qtd").val() !="") && ($("#"+resource.Description+"_qtd").val() !=0)) && (($("#"+resource.Description+"_prc").val() !="") && ($("#"+resource.Description+"_prc").val() !=0)) ){
										
										if((!isNaN($("#"+resource.Description+"_qtd").val())) && (!isNaN($("#"+resource.Description+"_prc").val()))){
											var qtd = $("#"+resource.Description+"_qtd").val();
											var prc	= $("#"+resource.Description+"_prc").val();
											socket.emit('onCreateOffer',{"userId" : userData.userId, "idResource" : resource.idBasecResouce, "qtd" : qtd, "prc" : prc});
										}else{
											alert("Invalid type of input!");
										}
									}
								}
							});
							//clearing the form
							$( "#dialogSell" ).html('');
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( "#dialogSell" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						//clearing the form
						$( "#dialogSell" ).html('');
						$( this ).dialog( "close" );
					}
				});

				//////////////////////////////////
				//POPULATING THE SELL MARKET
				var sellContent = "";
				sellContent 	= "<table border=0 width=100%><tr>";
				sellContent     = sellContent + "<td width=(100/3) align=center><b>Resource</b></td>";
				sellContent     = sellContent + "<td width=(100/3) align=center><b>Qtd</b></td>";
				sellContent     = sellContent + "<td width=(100/3) align=center><b>Price p/ Unit</b></td>";
				sellContent     = sellContent + "</tr>";

				$.each(rows[0], function(i, obj) {
					var resource = rows[0][i];
					if(resource.Description == "gold"){
					}else{
						resource.img = me.loader.getImage(jsApp.toTitleCase(resource.Description));
						resource.img = $(resource.img).attr("src");
						
						var resourceSell = "<tr> <td align=center width=(100/3)> <img src='"+resource.img+"' alt='"+resource.Description+"' height='32' width='32'></img> </td>";
						resourceSell	 = resourceSell + "<td align=center width=(100/3)><input  type='number' name='"+resource.Description+"_qtd' id='"+resource.Description+"_qtd' size=5 /></td>";
						resourceSell	 = resourceSell + "<td align=center width=(100/3)><img src='data/sprite/Gold.png' /><input  type='number' name='"+resource.Description+"_prc' id='"+resource.Description+"_prc' size=5 /></td>";
						resourceSell 	 = resourceSell +"</tr>";
						resourceSell     = resourceSell + "<tr><td ></td><td align=center><img src='data/sprite/division.png' width=60% height=60%/></td><td></td></tr>";
						sellContent		 = sellContent + resourceSell;
					}
				});
				
				sellContent	= sellContent + "</table>";
				
				$("#dialogSell").append(sellContent);
				$("#dialogSell").dialog( "open" );
			}
			socket.on('onSellMenu', sellMenuFun);

			////////////////////////////////////
			
			///////////////////////////////////////
			//after create a offer				//
			////						/////////
			var createOfferFun = function(rows,data) {
				//updating the resources
				jsApp.send("onResourcesUpdate", jsApp.getUserData());
				//
				if(rows[0][0].Msg == 'Your Offert Was Created'){
					alertify.success(rows[0][0].Msg);
				}else{
					alertify.error(rows[0][0].Msg);
				}
			}
			socket.on('onCreateOffer', createOfferFun);
			///////////////////////////////////
			
			///////////////////////////////////////
			//Opening buy menu					//
			////						/////////
			var buyMenuFun = function(rows) {
				//////////////////////////
				//CREATING THE MODAL FORM
				var userData  = jsApp.getUserData();
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogBuy");
				div.setAttribute("name","dialogBuy");
				div.setAttribute("title","Select what you want to Buy :");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogBuy" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Send": function() {
							//creating new market offer
							$.each(rows[0], function(i, obj) {
								var resource = rows[0][i];
								//if it's a valid number, send to the server
								if( ($("#"+resource.idOffert+"_qtd").val() !="") ){
									if(!isNaN($("#"+resource.idOffert+"_qtd").val())){
										var qtd 		 = $("#"+resource.idOffert+"_qtd").val();
										var idUserOffert = $("#"+resource.idOffert+"_idUserOffert").val();
										var offerDesc    = $("#"+resource.idOffert+"_Description").val();
										var userData	 = jsApp.getUserData(); 
										socket.emit('onBuyOffer',{"userId" : userData.userId, "idOffert" : resource.idOffert, "Qtd" : qtd, "idUserOffert" : idUserOffert, "offerDesc" : offerDesc});
									}else{
										
										alert("Invalid type of input!");
									}
								}
							});
							//clearing the form
							$( "#dialogBuy" ).html('');
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( "#dialogBuy" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
						//clearing the form
						$( "#dialogBuy" ).html('');
						$( this ).dialog( "close" );
					}
				});

				//////////////////////////////////
				//POPULATING THE BUY MARKET
				var buyContent = "";
				buyContent 	= "<table border=0 width=100%><tr>";
				buyContent     = buyContent + "<td width=(100/5) align=center><b>Id Offer</b></td>";
				buyContent     = buyContent + "<td width=(100/5) align=center><b>Resource</b></td>";
				buyContent     = buyContent + "<td width=(100/5) align=center><b>Qtd</b></td>";
				buyContent     = buyContent + "<td width=(100/5) align=center><b>Price p/ Unit</b></td>";
				buyContent     = buyContent + "<td width=(100/5) align=center><b>Buy</b></td>";
				buyContent     = buyContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					var resource = rows[0][i];
					console.log(resource);
					resource.img = me.loader.getImage(jsApp.toTitleCase(resource.Description));
					resource.img = $(resource.img).attr("src");
					
					var resourceBuy = "<tr><td id='id_"+resource.idOffert+"'align=center width=(100/5)>"+resource.idOffert+"</td>";
					resourceBuy = resourceBuy + "<td align=center width=(100/4)> <img src='"+resource.img+"' alt='"+resource.Description+"' height='32' width='32'></img> </td>";
					resourceBuy = resourceBuy + "<td align=center width=(100/5)>"+resource.Qty+"</td>";
					resourceBuy = resourceBuy + "<td align=center width=(100/5)><img src='data/sprite/Gold.png' />"+resource.Money+"</td>";
					resourceBuy	= resourceBuy + "<td align=center width=(100/5)><input type='number' name='"+resource.idOffert+"_qtd' id='"+resource.idOffert+"_qtd' size=5 /></td>";
					resourceBuy	= resourceBuy + "<input type='hidden' id='"+resource.idOffert+"_idUserOffert' value='"+resource.idUser+"' />";
					resourceBuy	= resourceBuy + "<input type='hidden' id='"+resource.idOffert+"_Description' value='"+resource.Description+"' />";
					resourceBuy = resourceBuy + "<tr><td></td><td></td><td  align=center><img src='data/sprite/division.png' width=70% height=70%/></td><td></td><td></td></tr>";
					buyContent  = buyContent + resourceBuy + "</tr>";
					
				});
				buyContent	= buyContent + "</table>";
				$("#dialogBuy").append(buyContent);
				$("#dialogBuy").dialog( "open" );

			}
			socket.on('onBuyMenu', buyMenuFun);
			////////////////////////////////////
			
			///////////////////////////////////
			//after buy a offer				//
			////						/////
			var buyOfferFun = function(rows,data) {
				if(rows[0][0].Msg != "Done"){
					alertify.error(rows[0][0].Msg);
				}else{
					alertify.success('Transaction Done!');
					//updating the resources
					jsApp.send("onResourcesUpdate", jsApp.getUserData());
					//
				}
			}
			socket.on('onBuyOffer', buyOfferFun);
			///////////////////////////////////
			
			///////////////////////////////////////
			//Opening sell Unit menu			//
			////						/////////
			var sellUnitMenuFun = function(rows) {
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogSellUnit");
				div.setAttribute("name","dialogSellUnit");
				div.setAttribute("title","What unit do you want to sell ?");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogSellUnit" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").prop("checked",!$("input:checkbox").prop("checked"));
						},
						"Send": function() {
							//creating the new offer
							$("input:checkbox:checked").each(function(i, obj){
								var idUnit = $(this).val();
								var prc    = $("#unitPrc_"+idUnit).val();
								if( prc !=""){
									if(!isNaN(prc)){
										//sending to the server
										socket.emit("onCreateUnitOffer",{"userId" : userData.userId, "idUnit" : idUnit, "prc" : prc });
									}else{
										alert('Invalid Type of Input!');
									}
								}
							});
							
							//clearing the form
							$( "#dialogSellUnit" ).html('');
							$( this ).dialog( "close" );
							
						},
						Cancel: function() {
							$( "#dialogSellUnit" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
					}
				});

				//////////////////////////////////
				//POPULATING THE ARMY CHECKBOXES
				var sellUnitContent = '';
				sellUnitContent     = "<table border=0 width=100%><tr>";
				sellUnitContent     = sellUnitContent + "<td width=33% align=center><b>Unit</b></td>";
				sellUnitContent     = sellUnitContent + "<td width=33% align=center><b>Attributes</b></td>";
				sellUnitContent     = sellUnitContent + "<td width=33% align=center><b>Price</b></td>";
				sellUnitContent     = sellUnitContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						sellUnitContent = sellUnitContent + "<br>" + rows[0][i].Msg;
					}else{
						var unit 		   = rows[0][i];
						var imgStr 		   = unit.Description.replace(" ","_");
						
						var unitFace       = me.loader.getImage(imgStr+"_Avatar");
						unitFace       	   = $(unitFace).attr("src");
						
						var lifeImg        = me.loader.getImage("Life");
						lifeImg       	   = $(lifeImg).attr("src");
						
						var atkImg         = me.loader.getImage("Sword");
						atkImg       	   = $(atkImg).attr("src");
						
						var defImg         = me.loader.getImage("Shield");
						defImg			   = $(defImg).attr("src");
						
						var sellUnitCheckBox   = "<tr id='unitTr_"+unit.idArmy+"'  style='cursor:pointer'><td><input type='checkbox' name='idUnit' value='"+unit.idArmy+"'><img src='"+unitFace+"' /></input>"+unit.Unit_Name+"("+unit.Description+")</td>" ;
						sellUnitCheckBox       = sellUnitCheckBox + "<td align='center'><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br><img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</td>";
						sellUnitCheckBox	   = sellUnitCheckBox + "<td align=center><img src='data/sprite/Gold.png' /> : <input onfocus='onClickSelection(unitTr_"+unit.idArmy+","+'"checkbox"'+");' type='number' name='unitPrc_"+unit.idArmy+"' id='unitPrc_"+unit.idArmy+"' size=4 />";
						sellUnitCheckBox	   = sellUnitCheckBox + "<tr><td></td><td align=center><img src='data/sprite/division.png' width=70% height=70%/></td><td ></td></tr>";
						sellUnitContent 	   = sellUnitContent  + sellUnitCheckBox + "</tr>";
					}
				});
				sellUnitContent = sellUnitContent + "</table>";
				$("#dialogSellUnit").append(sellUnitContent);
				$( "#dialogSellUnit" ).dialog( "open" );
			}
			socket.on('onSellUnitMenu', sellUnitMenuFun);

			////////////////////////////////////
			
			///////////////////////////////////////
			//after create a unit offer				//
			////						/////////
			var createUnitOfferFun = function(rows,data) {
				if(rows[0][0].Msg == 'Your Unit Offert Was Created'){
					alertify.success(rows[0][0].Msg);
				}else{
					alertify.error(rows[0][0].Msg);
				}
			}
			socket.on('onCreateUnitOffer', createUnitOfferFun);
			///////////////////////////////////
			
			///////////////////////////////////////
			//Opening buy Unit menu			//
			////						/////////
			var buyUnitMenuFun = function(rows,data) {
				//////////////////////////
				//CREATING THE MODAL FORM
				var div 	  = document.createElement("div");
				div.setAttribute("id","dialogBuyUnit");
				div.setAttribute("name","dialogBuyUnit");
				div.setAttribute("title","What unit do you want to buy ?");
				div.setAttribute("style","display:none");
				
				$("body").append(div);
				
				$( "#dialogBuyUnit" ).dialog({
					autoOpen: false,
					height: 480,
					width: 600,
					modal: true,
					buttons: {
						"Check all": function() {
							$("input:checkbox").attr("checked",true);
						},
						"Send": function() {
							//creating the new offer
							
							$("input:checkbox:checked").each(function(i, obj){
								//sending to the server
								var idUnitOffer  = $(this).val();
								var idVillageDen = data.idVillageDen;
								var idUserOffer  = $('#'+idUnitOffer+'_idUserOffer').val();
								var unitDesc     = $('#'+idUnitOffer+'_Description').val();
								var unitImg      = $('#'+idUnitOffer+'_img').val();
								socket.emit("onBuyUnitOffer",{"userId" : userData.userId, "idUnitOffer" : idUnitOffer, "idVillageDen" : idVillageDen, "idUserOffer" : idUserOffer, "unitDesc" : unitDesc, "unitImg" : unitImg});
							});
							
							//clearing the form
							$( "#dialogBuyUnit" ).html('');
							$( this ).dialog( "close" );
							
						},
						Cancel: function() {
							$( "#dialogBuyUnit" ).html('');
							$( this ).dialog( "close" );
						}
					},
					close: function() {
					}
				});

				//////////////////////////////////
				//POPULATING THE ARMY CHECKBOXES
				var buyUnitContent = '';
				buyUnitContent     = "<table border=0 width=100%><tr>";
				buyUnitContent     = buyUnitContent + "<td width=15 align=center><b>Id Offer</b></td>";
				buyUnitContent     = buyUnitContent + "<td width=25 align=center><b>Unit</b></td>";
				buyUnitContent     = buyUnitContent + "<td width=25 align=center><b>Attributes</b></td>";
				buyUnitContent     = buyUnitContent + "<td width=20 align=center><b>Price</b></td>";
				buyUnitContent     = buyUnitContent + "<td width=15 align=center><b>Buy</b></td>";
				buyUnitContent     = buyUnitContent + "</tr>";
				
				$.each(rows[0], function(i, obj) {
					if(rows[0][i].Msg != undefined){
						buyUnitContent = buyUnitContent + "<br>" + rows[0][i].Msg;
					}else{
						var unit 		   = rows[0][i];
						console.log(unit);
						var imgStr 		   = unit.Description.replace(" ","_");
						
						var unitFace       = me.loader.getImage(imgStr+"_Avatar");
						unitFace       	   = $(unitFace).attr("src");
						
						var lifeImg        = me.loader.getImage("Life");
						lifeImg       	   = $(lifeImg).attr("src");
						
						var atkImg         = me.loader.getImage("Sword");
						atkImg       	   = $(atkImg).attr("src");
						
						var defImg         = me.loader.getImage("Shield"); 
						defImg			   = $(defImg).attr("src");
						
						var buyUnitCheckBox   = "<tr onclick='onClickSelection(this,"+'"checkbox"'+");' style='cursor:pointer'><td width=15 align=center ><div style='line-height: 55px;'>"+unit.idArmyOffert+"</div></td>";
						buyUnitCheckBox       = buyUnitCheckBox + "<td width=25 align=center ><img src='"+unitFace+"' /></input>"+unit.Unit_Name+"("+unit.Description+")</div></td>";
						buyUnitCheckBox       = buyUnitCheckBox + "<td width=25 align=center ><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br><img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</div></td>";
						buyUnitCheckBox	      = buyUnitCheckBox + "<td width=30 align=center ><img src='data/sprite/Gold.png' /> : "+unit.Money+"</div>";
						buyUnitCheckBox	      = buyUnitCheckBox + "<td width=15 align=center ><input type='checkbox' name='idUnitOffer_"+unit.idArmyOffert+"' id='idUnitOffer_"+unit.idArmyOffert+"' value='"+unit.idArmyOffert+"'></td>";
						buyUnitCheckBox		  = buyUnitCheckBox + "<input type='hidden' id='"+unit.idArmyOffert+"_idUserOffer' value='"+unit.idUser+"' />";
						buyUnitCheckBox	      = buyUnitCheckBox + "<input type='hidden' id='"+unit.idArmyOffert+"_Description' value='"+unit.Unit_Name+"("+unit.Description+")' />";
						buyUnitCheckBox	      = buyUnitCheckBox + "<input type='hidden' id='"+unit.idArmyOffert+"_img' value='"+unit.Description+"' />";
						buyUnitContent 	      = buyUnitContent  + buyUnitCheckBox + "</tr>";
						buyUnitContent		  = buyUnitContent  + "<tr><td></td><td><img src='data/sprite/division.png' width=80% height=80%/></td><td></td><td></td><td></td></tr>";
					}
				});
				buyUnitContent = buyUnitContent + "</table>";
				$("#dialogBuyUnit").append(buyUnitContent);
				$( "#dialogBuyUnit" ).dialog( "open" );
			}
			socket.on('onBuyUnitMenu', buyUnitMenuFun);

			////////////////////////////////////
			
			///////////////////////////////////////
			//after buy a unit offer			//
			////						/////////
			var buyUnitOfferFun = function(rows,data) {
				if(rows[0][0].Msg != "Done"){
					alertify.error(rows[0][0].Msg);
				}else{
					alertify.success('Transaction Done!');
					//updating the resources
					jsApp.send("onResourcesUpdate", jsApp.getUserData());
					//
				}
			}
			socket.on('onBuyUnitOffer', buyUnitOfferFun);
			///////////////////////////////////			
			
            this.parent();
            /////////////////
            // GAME CAMERA //
            /////////////////
            this.mousedown = false;
            this.mousemoved = false;
            this.mousemove = new me.Vector2d();
            this.mousedelta = new me.Vector2d();

            me.input.registerPointerEvent("mousedown", me.game.viewport, (function (e) {
                this.mousedown = true;
                this.mousemove = new me.Vector2d(~~me.input.changedTouches[0].x,~~me.input.changedTouches[0].y);
                //IF I HAVE CLIKED IN THE BUILDING HUD,DO NOT REMOVE IT
                if(gameHandler.activeHuds.buildingHUD != undefined){
					//IF I CLICKED IN THE UPDATE BUTTON
                    if(gameHandler.activeHuds.buildingHUD.UPRect.containsPointV(me.input.changedTouches[0])){
						var updatebuild = gameHandler.activeHuds.buildingHUD.upInfo;
						updatebuild.idVillage = this.idVillage;
						socket.emit("onRequestUpdate",updatebuild);
						if(gameHandler.activeHuds.buildingHUD.buildRect.containsPointV(me.input.changedTouches[0])){
						}
                    }else{
						//IF I CLICKED IN THE TRAIN UNIT BUTTON
                        if(gameHandler.activeHuds.buildingHUD.createUnitButton != undefined) {
                            if(gameHandler.activeHuds.buildingHUD.createUnitButton.containsPointV(me.input.changedTouches[0])) {
								this.mousedown = false;
								this.mousemoved = false;
                                var unitsICanMake = gameHandler.activeHuds.buildingHUD.upInfo.listUnitsCanMake;
								var thisBuilding  = gameHandler.activeHuds.buildingHUD.upInfo;
								//////////////////////////
								//CREATING THE MODAL FORM
								var div		 = document.createElement("div");
								div.setAttribute("id","dialogTrainUnit");
								div.setAttribute("name","dialogTrainUnit");
								div.setAttribute("title","Select the unit you want to train:");
								div.setAttribute("style","display:none");

								$("body").append(div);
								$( "#dialogTrainUnit" ).dialog({
									autoOpen: false,
									height: 480,
									width: 600,
									modal: true,
									buttons: {
										"Train" : function(){
											//SEND THE UNIT TO TRAIN
											$("input:radio[name*='unitSelect']:checked").each(function(i, obj){
												var idUnit   = $(this).val();
												var unitImg  = $('#unitImg_'+idUnit).val();
												var unitDesc = $('#unitDesc_'+idUnit).val();
												var data = {
													idBuildingBuilt  : thisBuilding.idBuildingBuilt,
													buildingX		 : thisBuilding.posX,
													buildingY		 : thisBuilding.posY,
													idUnit 			 : idUnit,
													Image			 : unitImg,
													faceImg			 : unitImg,
													Description		 : unitDesc,
													userId 			 : jsApp.getUserData().userId,
													idVillage		 : jsApp.getUserData().idVillage
												}
												socket.emit("onRequestUnit", data);
											});
											
											$( "#dialogTrainUnit" ).html('');
											$( this ).dialog( "close" );
										},
										
										Cancel: function() {
											$( "#dialogTrainUnit" ).html('');
											$( this ).dialog( "close" );
										}
									},
									close: function() {
										$("#dialogTrainUnit").html('');
									}
								});
								
								//////////////////////////////////
								//POPULATING THE UNIT MENU
								var trainUnitContent = "<table boder=0 width=100%><tr>";
								trainUnitContent 	 = trainUnitContent + "<td align='center' width=20%><b>UNIT</b></td>";
								trainUnitContent 	 = trainUnitContent + "<td align='center' width=40%><b>ATTRIBUTE</b></td>";
								trainUnitContent 	 = trainUnitContent + "<td align='center' width=40%><b>RESOURCES</b></td>";
								trainUnitContent 	 = trainUnitContent + "</tr>";
								var newUnit;
								var lastRsc;
								var lastUnit;
								$.each(unitsICanMake, function(i, obj) {
									var unit 	    = unitsICanMake[i];
									console.log(unit);
									var lifeImg     = me.loader.getImage("Life");
									lifeImg       	= $(lifeImg).attr("src");
									
									var atkImg      = me.loader.getImage("Sword");
									atkImg       	= $(atkImg).attr("src");
									
									var defImg      = me.loader.getImage("Shield");
									defImg			= $(defImg).attr("src");
									
									var unitDetail  = "<tr onclick='onClickSelection(this,"+'"radio"'+");' style='cursor:pointer'><td width=20%><b>"+unit.Description+"</b><p><br><input type='radio' name='unitSelect' value='"+unit.idUnit+"' ><img src='data/sprite/Characters/"+unit.Image+"_Front.png' /></p></td>"; 
									unitDetail      = unitDetail + "<input type='hidden' id='unitImg_"+unit.idUnit+"' value='"+unit.Image+"' />";
									unitDetail      = unitDetail + "<input type='hidden' id='unitDesc_"+unit.idUnit+"' value='"+unit.Description+"' />";
									unitDetail      = unitDetail + "<td width=40% align='center'><img src='"+atkImg+"' alt='Attack' /> : "+unit.Attack+" <br><img src='"+defImg+"' alt='Defense' /> : "+unit.Defense+" <br> <img src='"+lifeImg+"' alt='Life' /> : "+unit.Life+"</input></td>";
									unitDetail  	= unitDetail + "<td width=40% align='center'>";

									totalResources = unit.Resources.length;
									for(var i =0;i<totalResources;i++){
										var rscDescription = unit.Resources[i].Description;
										var rscQty		   = unit.Resources[i].Qty;
										var rscImg		   = me.loader.getImage(jsApp.toTitleCase(rscDescription));
										rscImg			   = $(rscImg).attr("src");
										unitDetail = unitDetail + "<p><img src='"+rscImg+"'/>"+rscQty+"</p>";
									}
									
									if(unit.Time_Creat != undefined){
										var img   = me.loader.getImage('Clock');
										img       = $(img).attr("src");
										unitDetail = unitDetail + "<p><img src='"+img+"'/>"+unit.Time_Creat+"</p>";						
									}
									unitDetail  = unitDetail + "</td><td width=40%>";
									
									unitDetail  = unitDetail + "</td></tr><tr><td width=20%></td><td width=60% align=center><img src='data/sprite/division.png' width=50% height=50%/></td><td width=20%></td></tr>";
									
									trainUnitContent = trainUnitContent + unitDetail;
								});
								trainUnitContent = trainUnitContent + "</table>";
								$("#dialogTrainUnit").append(trainUnitContent);
								$("#dialogTrainUnit").dialog("open");
                            }
                        }
						///////////////////////////////////
						
						//IF I CLICKED ON THE ALLOCATE BUTTON
						if(gameHandler.activeHuds.buildingHUD.allocateVillagerButton != undefined) {
							if(gameHandler.activeHuds.buildingHUD.allocateVillagerButton.containsPointV(me.input.changedTouches[0])){
								socket.emit('onAllocateUnitMenu', {"userId" : userData.userId, "idBuilding" : gameHandler.activeHuds.buildingHUD.upInfo.idBuildingBuilt});
							}
						}
						/////////////////////////////////////////
						
						//IF I CLICKED ON THE SELL BUTTON ON MARKET
						if(gameHandler.activeHuds.buildingHUD.sellMarketButton != undefined) {
							if(gameHandler.activeHuds.buildingHUD.sellMarketButton.containsPointV(me.input.changedTouches[0])){
								socket.emit("onSellMenu");
							}
						}
						/////////////////////////////////////////
						
						//IF I CLICKED ON THE BUY BUTTON ON MARKET
						if(gameHandler.activeHuds.buildingHUD.buyMarketButton != undefined) {
							if(gameHandler.activeHuds.buildingHUD.buyMarketButton.containsPointV(me.input.changedTouches[0])){
								socket.emit("onBuyMenu",userData.userId);
							}
						}
						/////////////////////////////////////////
						
						//IF I CLICKED ON THE SELL BUTTON ON MERCENARY DEN
						if(gameHandler.activeHuds.buildingHUD.sellDenButton != undefined) {
							if(gameHandler.activeHuds.buildingHUD.sellDenButton.containsPointV(me.input.changedTouches[0])){
								socket.emit('onSellUnitMenu', userData.userId);
							}
						}
						/////////////////////////////////////////
						
						//IF I CLICKED ON THE BUY BUTTON ON MERCENARY DEN
						if(gameHandler.activeHuds.buildingHUD.buyDenButton != undefined) {
							if(gameHandler.activeHuds.buildingHUD.buyDenButton.containsPointV(me.input.changedTouches[0])){
								socket.emit('onBuyUnitMenu', {"userId" : userData.userId, "idVillageDen" : gameHandler.activeHuds.buildingHUD.upInfo.idBuildingBuilt});
							}
						}
						/////////////////////////////////////////
						
						
						
                        //IF I CLICKED OUTSIDE THE HUD I'LL REMOVE IT.
                        me.game.remove(gameHandler.activeHuds.buildingHUD,true);
                        gameHandler.activeHuds.buildingHUD = undefined;
                        me.game.sort();
						
                        ///////////////////////////////////////////////
                    }
                }
                else if(gameHandler.activeHuds.unitMenu!=undefined) {
                    // do nothing but we need this here
                }
                else if(gameHandler.activeHuds.actionMenu != undefined && gameHandler.activeHuds.actionMenu.menuRect.containsPointV(me.input.changedTouches[0])) {
                    var menu = gameHandler.activeHuds.actionMenu;
                    // if i clicked the menu
                    if(menu.menuRect != undefined) {
                        if (menu.menuRect.containsPointV(me.input.changedTouches[0])) {
                            // if i clicked the "BUILD" button
                            if(menu.buildRect.containsPointV(me.input.changedTouches[0])) {
                                ///////// PUT THE HUD INTO THE SCREEN
                                // game.add(object, z)
                                //if(gameHandler.activeHuds.buildMenu!=undefined)
                                //    return;
                                socket.emit("onListBuilding", {"idVillage" : this.idVillage} );
							} else if(menu.squadRect.containsPointV(me.input.changedTouches[0])) {
								// IF I CLIKED ON CREATE ARMY
								socket.emit("onOpenCreateSquad", this.idVillage);
							} else if(menu.viewSquadRect.containsPointV(me.input.changedTouches[0])) {
								//IF I CLIKED ON VIEW SQUAD
								socket.emit("onViewVillageSquad", {"idVillage" : this.idVillage, "userId" : userData.userId});
                            } else if(menu.changeSquadRect.containsPointV(me.input.changedTouches[0])) {
								//IF I CLIKED ON SQUAD CHANGE VIEW 
								socket.emit("onSquadMergeView", {"userId" : userData.userId});
                            } else if(menu.transferSquadRect.containsPointV(me.input.changedTouches[0])) {
								//IF I CLIKED ON SQUAD TRANSFER VIEW 
								socket.emit("onSquadTransferView", {"userId" : userData.userId});
                            } else if(menu.worldRect.containsPointV(me.input.changedTouches[0])) {
							    //IF I CLIKED ON THE WORLD
								me.game.remove(this, true);
								me.state.change(me.state.OUTWORLD);
							}
                        }
                    }
                }
                //JUST DO IT IF ANY HUD IT'S NOT ON THE SCREEN
				else if((gameHandler.activeHuds.buildMenu == undefined) && (gameHandler.activeHuds.buildingArea == undefined)){

					var buildLayer = me.game.currentLevel.getLayerByName("Transp");	//getting the correct map layer to tile changes
					var tileIs     = jsApp.getPixelsForTile(~~e.gameScreenX, ~~e.gameScreenY);
					var pixelIs	   = jsApp.getTileForPixels(tileIs.x, tileIs.y);
					var tileid     = buildLayer.getTileId(me.input.changedTouches[0].x+me.game.viewport.pos.x, me.input.changedTouches[0].y+me.game.viewport.pos.y);// getting the current tileid we've clicked on
					if (tileid != null){ 
                        this.tileWhereBuildingIs = tileIs;
						socket.emit("onBuildingSelect",{"idVillage" : this.idVillage, "X" : tileIs.x, "Y" : tileIs.y, "pixelIs" : pixelIs});
					}

				}
                //
				        
            }).bind(this));

            me.input.registerPointerEvent("mouseup", me.game.viewport, (function (e) {
                this.mousedown = false;

            }).bind(this));

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


            // ADDING THE GAME GUI
            this.hud = new jsApp.ResourcesHUD();
           // this.gui = new jsApp.ActionMenu("Village", this.villageName);
            me.game.add(this.hud, 1000);
            //me.game.add(this.gui, 1000);
            // SORT GRAPHICS RENDERED TO THE SCREEN (SO IT CAN REDRAW IN THE RIGHT ORDER)
            me.game.sort();
        },
		
        draw: function (context) {
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
			me.game.remove(this.hud);
			me.game.remove(this.gui);
			if(this.templeTime != undefined){
				me.game.remove(this.templeTime);
			}
			me.game.reset();
			me.game.sort();
			//clearing the timeouts set
			jsApp.clearTimeOuts();
			//Destroying websockets event before create a new one	
			 jsApp.destroy("onListWorldVillage");
			 jsApp.destroy("onListUserVillages");
			 jsApp.destroy("onTransferSquads");
			 jsApp.destroy("onSquadTransferView");
			 jsApp.destroy("onVillageSelect");
			 jsApp.destroy("onListSquadAtk");
			 jsApp.destroy("onAtkVillage");
			 jsApp.destroy("onBuildingSelect");
             jsApp.destroy("onListVillageBuildings");
			 jsApp.destroy("onListVillageUnits");
			 jsApp.destroy("onRequestUpdate");
			 jsApp.destroy("onConstruct");
			 jsApp.destroy("onResourcesUpdate");
			 jsApp.destroy("onCheckUpdate");
			 jsApp.destroy("onConstructRequest");
			 jsApp.destroy("onConstructCheck");
			 jsApp.destroy("onRequestUnit");
			 jsApp.destroy("onUnitCheck");
			 jsApp.destroy("onListBuilding");
			 jsApp.destroy("onResourcesCollect");
			 jsApp.destroy("onSellMenu");	
			 jsApp.destroy("onOpenCreateSquad");
			 jsApp.destroy("onCreateSquad");
			 jsApp.destroy("onViewVillageSquad");
			 jsApp.destroy("onSquadDetail");
			 jsApp.destroy("onCreateOffer");
			 jsApp.destroy("onBuyMenu");
			 jsApp.destroy("onSellUnitMenu");
			 jsApp.destroy("onCreateUnitOffer");
			 jsApp.destroy("onBuyUnitMenu");
			 jsApp.destroy("onBuyUnitOffer");
			 jsApp.destroy("onSquadMergeView");
			 jsApp.destroy("onSquadMergeView2");
			 jsApp.destroy("onMergeSquad");
			 jsApp.destroy("onAlertTempleConquest");
			 jsApp.destroy("onCheckTempleTime");
			 jsApp.destroy("onAlertUserAtk");
			 jsApp.destroy("onAlertBuyResources");
			 jsApp.destroy("onAlertBuyUnit");
			 jsApp.destroy("onCheckVillageName");
			 jsApp.destroy("onAllocateUnitMenu");
			 jsApp.destroy("onAlocateUnit");
			 jsApp.destroy("onBuyOffer");
			/////////////////////////////////////////
        }
    });



// called whenever a new map gets loaded by the client
// Parameters
// - String MapName
function loadMap(mapname) {
    //me.state.change(me.state.PLAY);
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


