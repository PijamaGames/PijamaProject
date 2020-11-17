class AbstractEvent{
  constructor(id, autoStart, pos, dist){
    Object.assign(this, {id,autoStart,pos, dist});
    this.started = false;
    //this.ended = false;
  }

  MustStart(){
    if(!this.autoStart) return;
    let player = manager.scene.players.values().next().value;
    return Vec2.Distance(this.pos, player.transform.GetWorldCenter()) < this.dist;
  }

  Start(){

  }
}

class ScriptedEvent extends AbstractEvent{
  constructor(id, autoStart, pos, dist, repeat, onStart = function(){}){
    super(id, autoStart, pos, dist);
    this.repeat = repeat;
    this.onStart = onStart;
    this.used = false;
  }

  Start(){
    if(!this.used || this.repeat){
      this.used = true;
      Log("START SCRIPTED EVENT: "+this.id);
      this.onStart();
    }
  }

  ForceEnd(){
    this.used = true;
    Log("FORCED ENDED SCRIPTED EVENT: " + this.id);
  }
}

class Battle extends AbstractEvent{
  constructor(id, autoStart, pos, dist, spawnerRefs='', startEnable = '', startDisable = '', endEnable = '', endDisable = ''){
    super(id, autoStart, pos, dist);
    Object.assign(this, {spawnerRefs, startEnable, startDisable, endEnable, endDisable});
    //this.started = false;
    this.ended = false;
    this.onEndFunc = function(){};
    this.onStartFunc = function(){};
  }

  SetOnStart(func){
    this.onStartFunc = func;
    return this;
  }

  SetOnEnd(func){
    this.onEndFunc = func;
    return this;
  }

  ProcessRefs(){
    this.spawners = finder.FindObjectsWithBytecode(this.spawnerRefs);
    this.startEnableObjs = finder.FindObjectsWithBytecode(this.startEnable);
    for(let obj of this.startEnableObjs){
      obj.SetActive(false);
    }
    this.startDisableObjs = finder.FindObjectsWithBytecode(this.startDisable);
    this.endEnableObjs = finder.FindObjectsWithBytecode(this.endEnable);
    for(let obj of this.endEnableObjs){
      obj.SetActive(false);
    }
    this.endDisableObjs = finder.FindObjectsWithBytecode(this.endDisable);
    Log("BATTLE "+this.id+" REFS:");
    Log(this.spawners);
    Log(this.startEnableObjs);
    Log(this.startDisableObjs);
    Log(this.endEnableObjs);
    Log(this.endDisableObjs);
  }

  /*MustStart(){
    let player = manager.scene.players.values().next().value;
    return Vec2.Distance(this.pos, player.transform.GetWorldCenter()) < this.dist;
  }*/

  MustEnd(){
    let allSpawnersEnded = true;
    for(var spawner of this.spawners){
      if(!spawner.spawner.ended){
        allSpawnersEnded = false;
      }
    }
    let aux = allSpawnersEnded;
    return aux;
  }

  Start(){
    Log("battle " + this.id + "started");
    for(let spawner of this.spawners){
      spawner.spawner.started = true;
    }
    for(let obj of this.startEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.endEnableObjs){
      obj.SetActive(false);
    }
    for(let obj of this.startDisableObjs){
      obj.SetActive(false);
    }
    for(let obj of this.endDisableObjs){
      obj.SetActive(true);
    }
    this.started = true;
    this.onStartFunc();
  }

  End(){
    Log("battle " + this.id + "ended");
    for(let obj of this.endEnableObjs){
      obj.SetActive(true);
    }
    /*for(let obj of this.startEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.startDisableObjs){
      obj.SetActive(false);
    }*/
    for(let obj of this.endDisableObjs){
      obj.SetActive(false);
    }
    this.ended = true;
    this.onEndFunc();
  }

  ForceEnd(){
    Log("battle " + this.id + "forced ended");
    for(let obj of this.startEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.startDisableObjs){
      obj.SetActive(false);
    }
    for(let obj of this.endEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.endDisableObjs){
      obj.SetActive(false);
    }
    this.started = true;
    this.ended = true;
  }
}

class BattleController extends Component{
  constructor(battles = [], events = []){
    super();
    battleController = this;
    this.type = "battleController";
    this.started = false;
    this.battles = battles;
    this.events = events;
    this.battleMap = new Map();
    this.eventMap = new Map();
    for(let b of this.battles){
      this.battleMap.set(b.id, b);
    }
    for(let e of this.events){
      this.eventMap.set(e.id, e);
    }
    this.onStartBattle = function(){};
    this.onEndBattle = function(){};
  }


  get inBattle(){
    let inBattle = false;
    for(let battle of this.battles){
      if(battle.started && !battle.ended){
        inBattle = true;
      }
    }
    return inBattle;
  }

  AddEvent(e){
    this.events.push(e);
    this.battleMap.set(e.id, e);
  }

  SetOnStartBattle(func){
    this.onStartBattle = func;
    return this;
  }

  SetOnEndBattle(func){
    this.onEndBattle = func;
    return this;
  }

  CheckBattle(battle){
    if(!battle.ended){
      if(!battle.started && battle.MustStart()){
        battle.Start();
        this.onStartBattle(this.gameobj);
      } else if(battle.started && battle.MustEnd()){
        battle.End();
        this.onEndBattle(this.gameobj);
      }
    }
  }

  CheckEvent(e){
    if(e.MustStart()){
      e.Start();
    }
  }

  Update(){
    if(this.started){
      for(var battle of this.battles){
        this.CheckBattle(battle);
      }
      for(var e of this.events){
        this.CheckEvent(e);
      }
    }
  }

  Destroy(){
    battleController = null;
  }

  Start(){
    if(!this.started){
      this.started = true;
      Log("BATTLE MANAGER STARTED");
      for(var battle of this.battles){
        battle.ProcessRefs();
      }
    }
  }

  StartBattle(id){
    let b = this.battleMap.get(id);
    if(b && b!=null){
      b.Start();
    }
  }

  StartEvent(id){
    let e = this.eventMap.get(id);
    if(e && e!=null){
      e.Start();
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.battleController = this;
  }
}
var battleController = null;
