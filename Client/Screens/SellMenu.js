jsApp.SellMenu = function (marketInfo){
    var widgets = new Array();
    var x = 130;
    var y = 110;
	
	this.font  = new me.BitmapFont("BaseFont", 16);
	var ct = marketInfo[0].length - 1;
	
	while(ct--){
		var resInfo    = marketInfo[0][ct];
		var resource   = resInfo.Description;
		var idResource = resInfo.idBasecResouce;
		var resImg = new me.Rect(
            new me.Vector2d(
                x,
                y
            ),
            40,
            40
        );
		//resImg.Image = jsApp.toTitleCase(resource);
		resImg.imgW 	  = 40;
		resImg.imgH  	  = 40;
		resImg.info  	  = idResource;	
		resImg.type  	  = "button";
		resImg.buttonText = resource;
		
		var qtd = {
			type  : "text",
            size  : 18,
            color : "white",
            text  : 0,
            pos   : {
                x : x+50,
                y : y
            }
		
		}
		
		var plusBtn1 = new me.Rect(
			new me.Vector2d(
                x+65,
                y-14
            ),
            16,
            16
		);
		plusBtn1.type	   		  = "button";
		plusBtn1.buttonText 	  = "+";
		plusBtn1.hasClickFunction = true;
		plusBtn1.clickFunction    = function(qtd){
			qtd.text = qtd.text + 5;
		};
		
		var minusBtn1 = new me.Rect(
			new me.Vector2d(
                x+65,
                y+14
            ),
            16,
            16
		);
		
		minusBtn1.type	   		   = "button";
		minusBtn1.buttonText 	   = "-";
		minusBtn1.hasClickFunction = true;
		minusBtn1.clickFunction    = function(qtd){
			if(qtd.text > 0){
				qtd.text = qtd.text - 5;
			}
		};		
		
		var price = {
			type  : "text",
            size  : 18,
            color : "white",
            text  : 0,
            pos   : {
                x : x+150,
                y : y
            }
		
		}
		var plusBtn2 = new me.Rect(
			new me.Vector2d(
                x+165,
                y-14
            ),
            16,
            16
		);
		plusBtn2.type	   		  = "button";
		plusBtn2.buttonText 	  = "+";
		plusBtn2.hasClickFunction = true;
		plusBtn2.clickFunction    = function(price){
			price.text = price.text + 5;
		};
		
		
		var minusBtn2 = new me.Rect(
			new me.Vector2d(
                x+165,
                y+14
            ),
            16,
            16
		);
		
		minusBtn2.type	   		   = "button";
		minusBtn2.buttonText 	   = "-";
		minusBtn2.hasClickFunction = true;
		minusBtn2.clickFunction    = function(price){
			if(price.text > 0){
				price.text = price.text - 5;
			}
		};
		
		var doneBtn = new me.Rect(
			new me.Vector2d(
                x+200,
                y
            ),
            100,
            40
		);
		doneBtn.type	   		 = "button";
		doneBtn.buttonText 	     = "Done";
		doneBtn.hasClickFunction = true;
		doneBtn.clickFunction    = function(){
		
		};
		
		widgets.push(resImg);
		widgets.push(qtd);
		widgets.push(plusBtn1);
		widgets.push(minusBtn1);
		widgets.push(price);
		widgets.push(plusBtn2);
		widgets.push(minusBtn2);
		widgets.push(doneBtn);
		
		y+= 50;
	}
	
    new jsApp.GenericMenu("sellMenu", widgets, "Sell Menu");

};