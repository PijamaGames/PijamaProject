"use strict;"
const DEBUG = true;
const DEBUG_VISUAL = true;
const EDITOR_MODE = false;

var timesCalled = 0.0;
var timesComputed = 0.0;

var manager;
function Main(){
  Log("Main");
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  manager.AddScene(new Scene("tileTestScene", BC_tileTestScene));
  manager.AddScene(new Scene("mainMenu", BC_MainMenu));
  manager.AddScene(new Scene("optionMenu", BC_Options));
  manager.AddScene(new Scene("gallery", BC_Gallery));
  manager.AddScene(new Scene("start", BC_Start));
  manager.Start('start');
}

function Log(text){
  if(DEBUG) console.log(text);
}
