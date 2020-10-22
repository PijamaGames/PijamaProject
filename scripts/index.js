"use strict;"
const DEBUG = true;
const DEBUG_VISUAL = false;
const EDITOR_MODE = false;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  manager.AddScene(new Scene("tileTestScene", BC_tileTestScene));
  manager.Start('tileTestScene');
}

function Log(text){
  if(DEBUG) console.log(text);
}
