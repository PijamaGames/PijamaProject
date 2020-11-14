"use strict;"
const DEBUG = true;
var DEBUG_VISUAL = false;
const EDITOR_MODE = true;
const DEBUG_PHYSICS = false;

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
    scene.camera.camera.FadeIn(2.0);
    lighting.SetCurrentLight(1);
    ReturnGame(true);
  }).SetOnWakeUp((scene)=>{
    ReturnGame(false);
  }).SetOnSleep(()=>{
    ExitGame(true);
  }).SetOnUnload(()=>{
    ExitGame(false);
  }));
  manager.AddScene(new Scene("cutScene1", BC_CutScene1).SetOnLoad(()=>{
    let obj=finder.FindObjectsByType("CutScene1");
    obj[0].audioSource.Loop("kinematicSound",true);
    obj[0].audioSource.Play("kinematicSound");

  }).SetOnUnload(()=>{
    let obj=finder.FindObjectsByType("CutScene1");
    obj[0].audioSource.Stop("kinematicSound");
  }));
  manager.AddScene(new Scene("cutScene2", BC_CutScene2).SetOnLoad(()=>{
    let obj=finder.FindObjectsByType("CutScene2");
    obj[0].audioSource.Loop("kinematicSound",true);
    obj[0].audioSource.Play("kinematicSound");
  }));
  manager.AddScene(new Scene("cutScene3", BC_CutScene3).SetOnUnload(()=>{
    let obj=finder.FindObjectsByType("CutScene2");
    obj[0].audioSource.Stop("kinematicSound");
    manager.SetInMenu(true);
  }));
  manager.AddScene(new Scene("multiGame1", BC_MultiGame1).SetOnLoad(()=>{
    ArenaScene(false);
  }).SetOnUnload(()=>{
    ArenaScene(true);
  }));
  manager.AddScene(new Scene("multiGame2", BC_MultiGame2).SetOnLoad(()=>{
    ArenaScene(false);
  }).SetOnUnload(()=>{
    ArenaScene(true);
  }));
  manager.AddScene(new Scene("multiGame3", BC_MultiGame3).SetOnLoad(()=>{
    ArenaScene(false);
  }).SetOnUnload(()=>{
    ArenaScene(true);
  }));
  manager.AddScene(new Scene("multiGame4", BC_MultiGame4).SetOnLoad(()=>{
    ArenaScene(false);
  }).SetOnUnload(()=>{
    ArenaScene(true);
  }));
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

function ReturnGame(newScene){
  if(!newScene)input.HideVirtualInputs(false);
  manager.singleGameMusic.LoopAll(true);
  manager.singleGameMusic.PlayAll();

  manager.SetInMenu(false);
}

function ExitGame(sleep){
  let music=finder.FindComponents("AudioSource");
  if(sleep){
    manager.singleGameMusic.PauseAll();
    for(var m of music){
      m.PauseAll();
    }
    manager.SetInMenu(true);
  }
  else{
    manager.singleGameMusic.StopAll();
    for(var m of music){
      m.StopAll();
    }
  }
  input.HideVirtualInputs(true);
}

function ArenaScene(out){
  if(user.isHost) input.HideVirtualInputs(out);
  let music=finder.FindObjectsByType("PauseFromMultiGame");
  if(!out) {
    music[0].audioSource.Play("arenaMusic");
    manager.menuSound.PauseAll();
  }
  else {
    manager.menuSound.PlayAll();
    music[0].audioSource.Stop("arenaMusic");
  }
}
