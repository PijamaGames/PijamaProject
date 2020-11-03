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
      case frontendEvents.LOGIN:
        var inputField = document.getElementById("userName");
        if(msg.userAvaible){
          new User(inputField.value, msg.points, msg.controlPoint);
          manager.LoadScene("mainMenu");
          inputField.hidden=true;
          Log("user avaible");
        } else {
          inputField.value = "Usuario no disponible";
          Log("user not avaible");
        }

        break;
      default:

    }
  };
}
