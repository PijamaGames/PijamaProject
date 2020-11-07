var serverURL = "http://localhost:8080";
var webSocketURL = "localhost:8080/player";
var socket = null;
var publicRooms = [];
var roomButtons = [];
var gameStarted = false;

const frontendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  CONNECTION_LOST: "CONNECTION_LOST",
  START_GAME: "START_GAME",
}

const backendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  LEAVE_ROOM:"LEAVE_ROOM",
  START_GAME:"START_GAME",
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
    }
  };
}

function StartGame(msg){
  manager.LoadScene("multiGame");
  gameStarted = true;
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
    })
    user.hostName=room;
    manager.LoadScene("room");
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
