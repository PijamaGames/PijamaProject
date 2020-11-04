var serverURL = "http://localhost:8080";
var webSocketURL = "localhost:8080/player";
var socket = null;

const frontendEvents = {
  LOGIN:"LOGIN",
}

const backendEvents = {
  LOGIN:"LOGIN",
}

async function getAllUsers(){
  let response = await fetch(serverURL+"/users/findAllUsers");
  let users = await response.json();

  Log(users);
}

function SendWebSocketMsg(msg){
  socket.send(JSON.stringify(msg));
}

function InitWebSocket(onOpenCallback){
  socket = new WebSocket("ws://"+webSocketURL);

  socket.onopen = ()=>{
    Log("WebSocket opened");
    onOpenCallback();
  };

  socket.onmessage=(message)=>{
    var msg=JSON.parse(message.data);
    Log("[FRONTEND] "+msg.event);
    switch (msg.event) {
      case frontendEvents.LOGIN: Login(msg); break;
    }
  };
}

function Login(msg){
  var inputField = document.getElementById("userName");
  if(msg.userAvaible){
    new User(inputField.value, msg.points, msg.controlPoint);
    manager.LoadScene("mainMenu");
    Log("user avaible");
  } else {
    inputField.value = "";
    var wrongNameElem = document.getElementById("wrongName");
    wrongNameElem.hidden = false;
    setTimeout(()=>{
      wrongNameElem.hidden = true;
    }, 4000);

    Log("user not avaible");
  }
}
