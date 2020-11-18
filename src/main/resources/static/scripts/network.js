var serverURL = "https://nelu-lotus-guardian.herokuapp.com/";
var webSocketURL = "nelu-lotus-guardian.herokuapp.com/player/websocket";
//var serverURL = "https://localhost:8080";
//var webSocketURL = "localhost:8080/player/websocket";
//var serverURL = "https://192.168.18.31:8080";
//var webSocketURL = "192.168.18.31:8080/player/websocket";

var socket = null;
var publicRooms = [];
var roomButtons = [];
var gameStarted = false;
var sendEntitiesRate = 12;
var minutes;
var seconds;
var networkDelta = 0.0;
var networkMs = 0.0;
var lastAliveSet = new Set();
var couldNotConnectEvent = new EventDispatcher();

const frontendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  CONNECTION_LOST: "CONNECTION_LOST",
  START_GAME: "START_GAME",
  RECEIVE_ENTITIES:"RECEIVE_ENTITIES",
  RECEIVE_ENEMY:"RECEIVE_ENEMY",
  END_GAME:"END_GAME",
  GET_RANKING:"GET_RANKING",
}

const backendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  LEAVE_ROOM:"LEAVE_ROOM",
  START_GAME:"START_GAME",
  SEND_ENTITIES:"SEND_ENTITIES",
  SEND_ENEMY:"SEND_ENEMY",
  END_GAME:"END_GAME",
  UPDATE_CONTROLPOINT:"UPDATE_CONTROLPOINT",
  GET_RANKING:"GET_RANKING",
  ALIVE_WS:"ALIVE_WS",
}

function CreateEntitiesMsg(){
  return {
    event:"SEND_ENTITIES",
    minutes:minutes,
    seconds:seconds,
  }
}

function SendEntitiesInfo(){
  msgs = [];
  msgs.push(CreateEntitiesMsg());
  let msg = msgs[0];
  let i = 0;
  let aliveKeys = new Set();
  let info;
  for(var [key, value] of manager.scene.networkEntities){
    info = value.GetInfo();
    if(info.active || (lastAliveSet.has(info.key) && !info.active)){
      msg["info"+i] = info;
      aliveKeys.add(key);
      i++;
      if(i == 30){
        msg.numEntities = i;
        let l = msgs.push(CreateEntitiesMsg());
        msg = msgs[l-1];
        i = 0;
      }
    }
  }
  for(var k of lastAliveSet){
    if(!aliveKeys.has(k)){
      msg["info"+i] = {
        key:k,
        destroyed:true
      }
      //Log("SEND DESTROYED");
      i++;
      if(i == 30){
        msg.numEntities = i;
        let l = msgs.push(CreateEntitiesMsg());
        msg = msgs[l-1];
        i = 0;
      }
    }
  }
  lastAliveSet = aliveKeys;
  if(!msg.numEntities){
    msg.numEntities = i;
  }

  for(var m of msgs){
    //Log(m);
    SendWebSocketMsg(m);
  }

}

function SendEntitiesLoop(){
  if(user.isHost){
    setTimeout(function(){
      SendEntitiesInfo();
      SendEntitiesLoop();
    }, (1/sendEntitiesRate)*1000);
  }
}

function StartSendEntitiesLoop(){
  SendEntitiesInfo();
  SendEntitiesLoop();
}

function ReceiveEntities(msg){
  if(!user.isClient) return;
  var newMs = Date.now();
  networkDelta = (newMs - networkMs) / 1000.0;
  networkMs = newMs;

  if(user.isHost) return;
  let chronometer=document.getElementById("chronometer");
  chronometer.innerHTML=msg.minutes+":"+msg.seconds;

  let numEntities = msg.numEntities;
  let info;
  let obj;


  for(var i = 0; i < numEntities; i++){
    info = msg["info"+i];
    if(info.destroyed){
      //Log("RECEIVE DESTROYED");
      let k = info.key;
      if(manager.scene.networkEntities.has(k)){
        manager.scene.networkEntities.get(k).gameobj.Destroy();
      }
      continue;
    }
    if(!manager.scene.networkEntities.has(info.key)){
      obj = prefabFactory.CreateObj(info.type, new Vec2(info.posX, info.posY), info.height, null, info.id);
    } else {
      obj = manager.scene.networkEntities.get(info.key).gameobj;
    }

    obj.networkEntity.SetTargetPosition(new Vec2(info.posX, info.posY));
    //obj.transform.SetWorldPosition(new Vec2(info.posX, info.posY));
    obj.transform.height = info.height;

    if(obj.active != info.active){
      obj.SetActive(info.active);
    }

    if(info.tileX){
      obj.renderer.tile.Set(info.tileX, info.tileY);
      obj.renderer.SetTint(info.tintR, info.tintG, info.tintB);
    }
    if(info.ratio && obj.lightSource){
      obj.lightSource.ratio = info.ratio;
      obj.lightSource.strength = info.strength;
    }
    if(info.anim){
      if(obj.renderer.anim != info.anim){
        obj.renderer.SetAnimation(info.anim);
      }
    }
    if(obj.rigidbody && info.velocityX) {
      obj.rigidbody.velocity.x = info.velocityX;
      obj.rigidbody.velocity.y = info.velocityY;
    }
  }

  /*for(var [key,value] of manager.scene.networkEntities){
    if(!keySet.has(key)){
      value.Destroy();
    }
  }*/

  //manager.scene.camera.camera.UpdateCam(networkDelta);
}

function RequestRanking(){
  SendWebSocketMsg({
    event:backendEvents.GET_RANKING
  });
}

function GetRanking(msg) {
  var ranking = document.getElementById("rankingText");
  var text="";
  for (i=0; i<msg.numUsers; i++){
    text+=msg["point"+i]+ " "+msg["user"+i]+"<br>";
  }
  ranking.innerHTML=text;
}

function SendWebSocketMsg(msg) {
  if(socket != null)
    socket.send(JSON.stringify(msg));
}

function ReceiveEnemy(msg){
  let obj;
  Log("ENEMY TYPE: " + msg.type);
  let sound=finder.FindObjectsByType("PauseFromMultiGame");
  sound[0].audioSource.Play("putEnemy");
  switch(msg.type){
    case 0:
      obj = prefabFactory.CreateObj("MonkeyEnemy", new Vec2(msg.positionX, msg.positionY));
      break;
    case 1:
      obj = prefabFactory.CreateObj("BeekeeperEnemy", new Vec2(msg.positionX, msg.positionY));
      break;
  }
}

function SendEnemy(type, position){
  SendWebSocketMsg({
    event:backendEvents.SEND_ENEMY,
    type:type,
    positionX:position.x,
    positionY:position.y
  });
}

function InitWebSocket(onOpenCallback) {
  //socket = new WebSocket("wss://" + webSocketURL);
  socket = new WebSocket("wss://" + webSocketURL);

  socket.onerror = (evt)=>{
    console.log("WEBSOCKET ERROR");
    console.log(evt);
    couldNotConnectEvent.Dispatch();
  }

  socket.onopen = () => {
    console.log("WebSocket opened");
    if(onOpenCallback){
      onOpenCallback();
    }
  };

  socket.onclose = ()=>{
    console.log("Websocket closed");
    manager.LoadScene('focusLost');
    if(user && user != null){
      user.isHost = false;
      user.isClient = false;
    }
    socket = null;
  };

  socket.onmessage = (message) => {
    var msg = JSON.parse(message.data);
    Log("[FRONTEND] " + msg.event);
    switch (msg.event) {
      case frontendEvents.LOGIN:
        Login(msg);
        break;
      case frontendEvents.CREATE_ROOM:
        CreateRoom(msg);
        break;
      case frontendEvents.JOIN_ROOM:
        JoinRoom(msg);
        break;
      case frontendEvents.GET_PUBLIC_ROOMS:
        GetPublicRoom(msg);
        break;
      case frontendEvents.CONNECTION_LOST :
        ConnectionLost(msg);
        break;
      case frontendEvents.START_GAME:
        StartGame(msg);
        break;
      case frontendEvents.RECEIVE_ENTITIES:
        ReceiveEntities(msg);
        break;
      case frontendEvents.RECEIVE_ENEMY:
        ReceiveEnemy(msg);
        break;
      case frontendEvents.END_GAME:
        EndGame(msg);
        break;
      case frontendEvents.GET_RANKING:
        GetRanking(msg);
        break;
    }
  };
}


function StartGame(msg){
  switch(manager.choosenEnviroment){
    case 1: manager.LoadScene("multiGame1");
      break;
    case 2: manager.LoadScene("multiGame2");
      break;
    case 3: manager.LoadScene("multiGame3");
      break;
    case 4: manager.LoadScene("multiGame4");
      break;
  }
  gameStarted = true;

  if(user.isHost){
    //prefabFactory.CreateObj("Nelu");
    StartSendEntitiesLoop();
  } else {
    Log("creating master");
    prefabFactory.CreateObj("Master");
    networkMs = Date.now();
  }
}

function EndGame(msg){
  //manager.LoadScene("connectionFailed");
  //var text=document.getElementById("ConnectionTitle");
  user.SetUserWinner(msg.hostWinner == user.isHost);

}

function SendEndGame(hostWinner){
  SendWebSocketMsg({
    event:backendEvents.END_GAME,
    hostWinner:hostWinner
  })
}

function CreateRoom(msg) {
  if (msg.room != -1) {
    user.hostName = user.name;
    user.isHost=true;
    manager.LoadScene("room");
  }
}

function JoinRoom(msg) {
  if(user.isHost){
    let text=document.getElementById("WaitingMessage");
    text.innerHTML=manager.english? (msg.clientName+" has joined to the room"):(msg.clientName+" se ha unido a la sala");
    var obj=finder.FindObjectsByType("MultiGameFromRoom");
    if(obj.length>0) obj[0].SetActive(true);
  } else {
    Log("ROOM: " + msg.room);
    if (msg.room != "") {
      manager.LoadScene("room");
      let text=document.getElementById("WaitingMessage");
      user.hostName=msg.room;
      text.innerHTML=manager.english? ("You've joined to "+user.hostName+" room"):("Te has unido a la sala de "+user.hostName);
      user.isClient=true;
      manager.choosenEnviroment=msg.enviroment;
      lighting.currentLight=msg.lighting;
      lighting.SetCurrentLight(msg.lighting);

    }
  }
}

function GetPublicRoom(msg) {
  var buttons = document.getElementById("buttonsList");
  let numButtons = roomButtons.length;
  publicRooms = [];
  for (var i = 0; i < msg.numRooms; i++){
    var room = msg["room" + i];
    var button;
    if(i >= numButtons){
      button = document.createElement("input");
      button.type = "button";
      buttons.appendChild(button);
      roomButtons.push(button);
    } else {
      button = roomButtons[i];
    }
    publicRooms.push(room);

    button.value = manager.english?("Level "+msg["enviroment"+i]+"\t"+room):("Nivel "+msg["enviroment"+i]+"\t"+room);
    button.onclick = Onclick(room, msg["enviroment"+i],msg["lighting"+i]);
  }

  for(var i = msg.numRooms; i < numButtons; i++){
    buttons.removeChild(roomButtons[i]);
    roomButtons.splice(msg.numRooms, 1);
  }
}
function Onclick(room,enviroment,light){
  return function(){
    SendWebSocketMsg({
      event:"JOIN_ROOM",
      hostName: room,
    });
  }
}

function ConnectionLost(msg) {
  if(gameStarted || user.isClient){
    manager.LoadScene("connectionFailed");
  } else if(user.isHost) {
    var text=document.getElementById("WaitingMessage");
    text.innerHTML=manager.english? "Waiting for a player...":"Esperando a otro jugador...";
    var obj=finder.FindObjectsByType("MultiGameFromRoom");
    if(obj.length>0) obj[0].SetActive(false);
  }
}

function Login(msg) {
  var inputField = document.getElementById("userName");
  if (msg.userAvaible && inputField.value != "") {
    new User(inputField.value, msg.points, msg.controlPoint);
    localStorage.setItem("userName", inputField.value);
    manager.SetInMenu(true);
    manager.LoadScene("mainMenu");
    Log("user avaible");
  } else if (inputField.value != "") {
    inputField.value = "";
    var wrongNameElem = document.getElementById("wrongName");
    wrongNameElem.hidden = false;
    setTimeout(() => {
      wrongNameElem.hidden = true;
    }, 4000);

    Log("user not avaible");
  }
}
