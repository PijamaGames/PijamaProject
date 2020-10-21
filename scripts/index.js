"use strict;"
const DEBUG = false;
const EDITOR_MODE = false;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  manager.Start();
}

function Log(text){
  if(DEBUG) console.log(text);
}
