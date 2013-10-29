var UnityAI = {

    takeMyMindAway : function(unit) {
        if(unit.target != undefined) {
           this.moveTowardsPoint(unit, unit.target );
            if(this.hasArriven(unit, unit.target))
                unit.target = undefined;
        } else {
            // definindo o alvo
            var target = {
                pos : jsApp.getRandomPointInScreen()
            };
            unit.target = target;
        }
    },

    moveTowardsPoint : function(unit, point) {
        //cria o vetor de distancia
        var xDir = point.pos.x - unit.pos.x;
        var yDir = point.pos.y - unit.pos.y;
        //pega distancia
        xDir =  xDir.clamp(-1,1);
        yDir =  yDir.clamp(-1,1);
        var modX = unit.accel.x * xDir;
		var dirX = Math.round(unit.accel.x * xDir);
		console.log
        var modY = unit.accel.y * yDir;
		
        if(dirX>0 && unit.dir != "right") {
            unit.renderable.setCurrentAnimation('left');
            unit.flipX(false);
            unit.dir = "right";
        }
        else if(dirX < 0  &&  unit.dir != "left") {
            unit.renderable.setCurrentAnimation('left');
            unit.dir = "left"
            unit.flipX(true);
        }
        else if(dirX == 0 && modY < 0  &&  unit.dir != "up") {
            unit.renderable.setCurrentAnimation('up');
            unit.dir = "up"
        }
        else if(dirX == 0 && modY > 0  && unit.dir != "down") {
            unit.renderable.setCurrentAnimation('down');
            unit.dir = "down"
        }

        unit.pos.x += modX;
        unit.pos.y += modY;
    },

    hasArriven : function (unit, target) {
        if(unit.pos.x == unit.target.pos.x && unit.pos.y == unit.target.pos.y) {
           return true;
        }
        if(unit.pos.x >= unit.target.pos.x-2 && unit.pos.x <= unit.target.pos.x+2) {
            if(unit.pos.y >= unit.target.pos.y-2 && unit.pos.y <= unit.target.pos.y+2) {
                return true;
            }
        }

    }
}