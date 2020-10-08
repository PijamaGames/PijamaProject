"use strict;"
const DEBUG = true;

var manager;
function Main(){
  Log("Main")
  manager = new Manager();
}

function Log(text){
  if(DEBUG) console.log(text);
}
