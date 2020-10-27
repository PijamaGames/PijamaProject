"use strict;"
const DEBUG = true;
const DEBUG_VISUAL = false;
const EDITOR_MODE = false;

var timesCalled = 0.0;
var timesComputed = 0.0;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  manager.AddScene(new Scene("tileTestScene", BC_tileTestScene));
  manager.AddScene(new Scene("mainMenu", BC_MainMenu));
  manager.AddScene(new Scene("optionMenu", BC_Options));
  manager.Start('mainMenu');
}

function Log(text){
  if(DEBUG) console.log(text);
}
