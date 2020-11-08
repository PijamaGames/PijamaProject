var serverURL = "http://localhost:8080";
var webSocketURL = "localhost:8080/player";
var socket = null;
var publicRooms = [];
var roomButtons = [];
var gameStarted = false;
var sendEntitiesRate = 30;
var minutes;
var seconds;

const frontendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  CONNECTION_LOST: "CONNECTION_LOST",
  START_GAME: "START_GAME",
  RECEIVE_ENTITIES:"RECEIVE_ENTITIES",
}

const backendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  LEAVE_ROOM:"LEAVE_ROOM",
  START_GAME:"START_GAME",
  SEND_ENTITIES:"SEND_ENTITIES",
}

function SendEntitiesInfo(){
  let numEntities = manager.scene.networkEntities.size;
  msg = {
    event:"SEND_ENTITIES",
    numEntities:numEntities,
    minutes:minutes,
    seconds:seconds,
  }

  let i = 0;
  for(var [key, value] of manager.scene.networkEntities){
    msg["info"+i] = value.GetInfo();
    i++;
  }

  SendWebSocketMsg(msg);
}

function SendEntitiesLoop(){
  setTimeout(function(){
    SendEntitiesInfo();
    SendEntitiesLoop();
  }, (1/sendEntitiesRate)*1000);
}

function StartSendEntitiesLoop(){
  SendEntitiesInfo();
  SendEntitiesLoop();
}

function ReceiveEntities(msg){
  if(user.isHost) return;
  let chronometer=document.getElementById("chronometer");
  chronometer.innerHTML=msg.minutes+":"+msg.seconds;

  let numEntities = msg.numEntities;
  let info;
  let obj;

  let keySet = new Set();

  for(var i = 0; i < numEntities; i++){
    info = msg["info"+i];
    keySet.add(info.key);

    Log(manager.scene.networkEntities);
    if(!manager.scene.networkEntities.has(info.key)){
      obj = prefabFactory.CreateObj(info.type, new Vec2(info.posX, info.posY), info.height, null, info.id);
    } else {
      obj = manager.scene.networkEntities.get(info.key).gameobj;
    }

    obj.transform.SetWorldPosition(new Vec2(info.posX, info.posY));
    obj.transform.height = info.height;

    if(obj.active != info.active){
      obj.SetActive(info.active);
    }

    if(info.tileX != -1){
      obj.renderer.tile.Set(info.tileX, info.tileY);
      obj.renderer.SetTint(info.tintR, info.tintG, info.tintB);
    }
    if(info.anim != -1){
      if(obj.renderer.anim != info.anim){
        obj.renderer.SetAnimation(info.anim);
      }
    }
  }

  for(var [key,value] of manager.scene.networkEntities){
    if(!keySet.has(key)){
      value.Destroy();
    }
  }
}

async function getRanking() {
  let response = await fetch(serverURL + "/users/ranking");
  let rankingInfo = await response.json();
  var ranking = document.getElementById("rankingText");
  Log(rankingInfo);
  var text="";
  for (i=0; i<rankingInfo.length; i++){
    text+=rankingInfo[i].points+ " "+rankingInfo[i].id+"<br>";
  }
  ranking.innerHTML=text;
}

function SendWebSocketMsg(msg) {
  socket.send(JSON.stringify(msg));
}

function InitWebSocket(onOpenCallback) {
  socket = new WebSocket("ws://" + webSocketURL);

  socket.onopen = () => {
    Log("WebSocket opened");
    onOpenCallback();
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
    }
  };
}


function StartGame(msg){
  manager.LoadScene("multiGame");
  gameStarted = true;

  if(user.isHost){
    StartSendEntitiesLoop();
  }
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
    text.innerHTML=msg.clientName+" se ha unido a la sala";
    var obj=finder.FindObjectsByType("MultiGameFromRoom");
    if(obj.length>0) obj[0].SetActive(true);
  } else {
    Log("ROOM: " + msg.room);
    if (msg.room != "") {
      manager.LoadScene("room");
      let text=document.getElementById("WaitingMessage");
      user.hostName=msg.room;
      text.innerHTML="Te has unido a la sala de "+user.hostName;
      user.isClient=true;
      manager.enviroment=msg.enviroment;
      manager.lighting=msg.lighting;

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
    button.value = "Escenario "+msg["enviroment"+i]+"\t"+room;
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
    text.innerHTML="Esperando a otro jugador...";
    var obj=finder.FindObjectsByType("MultiGameFromRoom");
    if(obj.length>0) obj[0].SetActive(false);
  }
}

function Login(msg) {
  var inputField = document.getElementById("userName");
  if (msg.userAvaible && inputField.value != "") {
    new User(inputField.value, msg.points, msg.controlPoint);
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
