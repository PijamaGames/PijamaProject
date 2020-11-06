var serverURL = "http://localhost:8080";
var webSocketURL = "localhost:8080/player";
var socket = null;
var publicRooms = new Set();

const frontendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  CONNECTION_LOST: "CONNECTION_LOST",
}

const backendEvents = {
  LOGIN: "LOGIN",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  GET_PUBLIC_ROOMS: "GET_PUBLIC_ROOMS",
  LEAVE_ROOM:"LEAVE_ROOM",
}

async function getAllUsers() {
  let response = await fetch(serverURL + "/users/findAllUsers");
  let users = await response.json();

  Log(users);
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
    }
  };
}

function CreateRoom(msg) {
  if (msg.room != -1) {
    user.hostName = user.name;
    user.isHost=true;
  }
}

function JoinRoom(msg) {
  if (msg.room != "") {
    user.hostName=msg.room;
    user.isClient=true;
    manager.enviroment=msg.enviroment;
    manager.lighting=msg.lighting;
    manager.LoadScene("room");
  }
}

function GetPublicRoom(msg) {
  for (var i = 0; i < msg.numRooms; i++) {
    if(!publicRooms.has(msg["room" + i])){
      publicRooms.add(msg["room" + i]);
      var buttons = document.getElementById("buttonsList");
      if (buttons && buttons != null) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Escenario "+msg["enviroment"+i]+"\t"+msg["room" + i];
        button.onclick = Onclick(msg["room" + i], msg["enviroment"+i],msg["lighting"+i]);
        buttons.appendChild(button);
      }
    }
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
    publicRooms.clear();
  }
}

function ConnectionLost(msg) {
  if(user.isClient){
    manager.LoadScene("connectionFailed");
  }


  //else
    //BORRAR LA SALA DE LA LISTA
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
