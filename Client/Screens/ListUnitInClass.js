jsApp.ListUnitInClass = function (unitList, idClass, className) {

    var widgets = new Array();

    this.className = className;
    var unitInClassList = new Array();
    var ct = unitList.length;
    while (ct--) {
        if (unitList[ct].idUnit == idClass)
            unitInClassList.push(unitList[ct]);
    }

    ct = unitInClassList.length;
    var x = 10;
    var y = 25;
    while(ct--) {
        var unit = unitInClassList[ct];
        var face = new me.Rect(
            new me.Vector2d(
                x,
                y
            ),
            160,
            48+6
        );
        face.Image = "maleFaces";
        face.imgH = 48;
        face.imgW = 40;
        face.type = "button";
        face.animFrame = unit.Face;
        console.log(unit);
        var name = {
            type : "text",
            size: 14,
            color: "lime",
           // containsPointV : function(){},
            text : unit.Unit_Name,
            pos : {
                x : x+46,
                y : y+2
            }
        }

        var stats = {
            type : "text",
            text : "HP:"+unit.Life+" Atk:"+unit.Attack+" Def:"+unit.Defense,
            size: 10,
          //  containsPointV : function(){},
            color: "white",
            pos : {
                x : x+46,
                y : y+2+16
            }
        }


        widgets.push(face);
        widgets.push(name);
        widgets.push(stats);
        y+= 56;
    }

    new jsApp.GenericMenu("ListUnitInClass", widgets, className+"s you own:");

};