jsApp.MarketMenu = function () {

    var widgets = new Array();
    var x = 10;
    var y = 25;
	
	var buyRect = new me.Rect(
		new me.Vector2d(
			((gameW/2)/2)-150,
			(gameH/2)-100
		),
		128,
		64
	);
	
	buyRect.type = "button";
	buyRect.hasClickFunction = true;
	buyRect.clickFunction    = function () {	
		alert("I wanna Buy, BITCH!");
	};
	buyRect.buttonText = "Buy";
	
	var sellRect = new me.Rect(
		new me.Vector2d(
			((gameW/2)/2)+150,
			(gameH/2)-100
		),
		128,
		64
	);
	
	sellRect.type = "button";
	sellRect.hasClickFunction = true;
	sellRect.clickFunction   = function () {	
		alert("I wanna Sell, BITCH!");
	};
	sellRect.buttonText = "Sell";
	
	widgets.push(buyRect);
	widgets.push(sellRect);
  

    new jsApp.GenericMenu("Market", widgets, "Market");

};