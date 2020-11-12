class Battle{
  constructor(id, autoStart, pos, dist, spawnerRefs='', startEnable = '', startDisable = '', endEnable = '', endDisable = ''){
    Object.assign(this, {id,autoStart,pos, dist, spawnerRefs, startEnable, startDisable, endEnable, endDisable});
    this.started = false;
    this.ended = false;
  }

  ProcessRefs(){
    /*let spawner;
    for(let ref of this.spawnerRefs){
      spawner = Spawner.refs.get(ref);
      if(spawner){
        this.spawners.push(spawner);
      } else {
        Log("SPAWNER NOT FOUND: " + ref);
      }
    }*/
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
    Log("REFS:");
    Log(this.spawners);
    Log(this.startEnableObjs);
    Log(this.startDisableObjs);
    Log(this.endEnableObjs);
    Log(this.endDisableObjs);
  }

  MustStart(){
    let player = manager.scene.players.values().next().value;
    return Vec2.Distance(this.pos, player.transform.GetWorldCenter()) < this.dist;
  }

  MustEnd(){
    let allSpawnersEnded = true;
    for(var spawner of this.spawners){
      if(!spawner.spawner.ended){
        allSpawnersEnded = false;
      }
    }
    return allSpawnersEnded && /*manager.scene.enemies.size*/Spawner.enemyCount == 0;
  }

  Start(){
    Log("battle " + this.id + "started");
    for(let spawner of this.spawners){
      spawner.spawner.started = true;
    }
    for(let obj of this.startEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.startDisableObjs){
      obj.SetActive(false);
    }
    this.started = true;
  }

  End(){
    Log("battle " + this.id + "ended");
    for(let obj of this.endEnableObjs){
      obj.SetActive(true);
    }
    for(let obj of this.endDisableObjs){
      obj.SetActive(false);
    }
    this.ended = true;
  }
}

class BattleController extends Component{
  constructor(battles = []){
    super();
    this.type = "battleController";
    this.started = false;
    this.battles = battles;
    this.battleMap = new Map();
    for(let b of this.battles){
      this.battleMap.set(b.id, b);
    }
  }

  CheckBattle(battle){
    if(!battle.ended){
      if(!battle.started && battle.MustStart()){
        battle.Start();
      } else if(battle.started && battle.MustEnd()){
        battle.End();
      }
    }
  }

  Update(){
    if(this.started){
      for(var battle of this.battles){
        this.CheckBattle(battle);
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

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.battleController = this;
    battleController = this;
  }
}
var battleController = null;
