"use strict;"
const DEBUG = true;
var DEBUG_VISUAL = false;
const EDITOR_MODE = true;
const DEBUG_PHYSICS = true;

var timesCalled = 0.0;
var timesComputed = 0.0;

var manager;
function Main(){
  Log("Main");
  manager = new Manager();
  manager.AddScene(new Scene("mainMenu", BC_MainMenu));
  manager.AddScene(new Scene("optionMenu", BC_Options));
  manager.AddScene(new Scene("gallery", BC_Gallery));
  manager.AddScene(new Scene("start", BC_Start));
  manager.AddScene(new Scene("pause", BC_Pause));
  manager.AddScene(new Scene("singleGame", BC_SingleGame).SetOnLoad((scene)=>{
    scene.canUseColibri = false;
    scene.canUseBees = false;
  }));
  manager.AddScene(new Scene("multiGame1", BC_MultiGame1));
  manager.AddScene(new Scene("multiGame2", BC_MultiGame2));
  manager.AddScene(new Scene("multiGame3", BC_MultiGame3));
  manager.AddScene(new Scene("multiGame4", BC_MultiGame4));
  manager.AddScene(new Scene("lobby", BC_Lobby));
  manager.AddScene(new Scene("chooseEnviroment", BC_ChooseEnviroment));
  manager.AddScene(new Scene("room", BC_Room));
  manager.AddScene(new Scene("connectionFailed", BC_ConnectionFailed));
  manager.AddScene(new Scene("focusLost", BC_FocusLost));
  manager.AddScene(new Scene("credits", BC_Credits));
  manager.AddScene(new Scene("controls", BC_Controls));
  manager.Start('start');
}

function Log(text){
  if(DEBUG) console.log(text);
}
