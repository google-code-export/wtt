var TASK_UpdateBuilding = function(data) {
    console.log("IM ON APP.JS --- idVillage:"+data.idVillage+" idBuilding:"+data.idBuilding+" x:"+data.x+" y:"+data.y+" buildTimer:"+data.buildTimer);
    console.log("time : "+systemtime);
    socket.emit("onUpdateCheck", data);
}