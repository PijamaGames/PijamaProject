"use strict;"
const DEBUG = true;
const EDITOR_MODE = true;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
  manager.AddScene(new Scene("testScene", BC_testScene));
  manager.Start();

  /*let v1 = new Vec2(-1,0);
  let v2 = new Vec2(1,0);
  Log(Vec2.ProjectOnRect(new Vec2(-2,-3), v1, v2, true).toString());*/
}

function Log(text){
  if(DEBUG) console.log(text);
}
