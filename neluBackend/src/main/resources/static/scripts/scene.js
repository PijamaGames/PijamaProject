class Scene{
  constructor(name, bytecode = null){
    Object.assign(this, {name, bytecode});
    this.CleanByteCode();
    this.onLoad = function(){};
    this.onUnload = function(){};
    this.onWakeUp = function(){};
    this.onSleep = function(){};
    this.gameobjs = new Map();
    this.staticGameobjs = new Map();
    this.buttons = new Set();
    this.colliderGroupsSet = new Set();
    this.colliderGroups= [];
    this.triggers = new Set();
    this.colliderGroupsWithRb = [];
    this.rigidbodies = new Set();
    this.players = new Set();
    this.enemies = new Set();
    this.domElements = new Set();
    this.networkEntities = new Map();
    this.paused = false;
    manager.scenes.set(this.name, this);
    this.masterController;
    this.GenerateCam();

    this.canUseColibri = true;
    this.canUseBees = true;
  }

  SetOnLoad(func){
    this.onLoad = func;
    return this;
  }

  SetOnUnload(func){
    this.onUnload = func;
    return this;
  }

  SetOnWakeUp(func){
    this.onWakeUp = func;
    return this;
  }

  SetOnSleep(func){
    this.onSleep = func;
    return this;
  }

  GenerateCam(){
    this.camera = /*this.AddGameobj(*/new Gameobj('camera',0, null, this, [
      new Camera(2.5),
      //new DebugController(3.0),
    ], new Transform(new Vec2(0,0), 0.0, new Vec2(manager.graphics.landscapeRes.x/tileSize+2, (manager.graphics.landscapeRes.y/tileSize)*2.0)));
  }

  Sleep(){
    Log("SLEEP " + this.name);
    this.onSleep(this);
    for(var elem of this.domElements){
      elem.element.hidden = true;
    }
  }

  WakeUp(){
    Log("WAKE UP " + this.name);
    this.onWakeUp(this);
    for(var elem of this.domElements){
      elem.element.hidden = !elem.active;
    }
  }

  Update(){
    for(let [key, gameobj] of this.gameobjs){
      gameobj.Update();
    }
    for(let button of this.buttons){
      button.UpdateButtonInput();
    }
  }

  AddGameobj(gameobj) {
    this.gameobjs.set(gameobj.key, gameobj);
    return gameobj;
  }

  AddStaticGameobj(gameobj){
    this.staticGameobjs.set(gameobj.key, gameobj);
    return gameobj;
  }

  RemoveGameobj(obj){
    this.staticGameobjs.delete(obj.key);
    this.gameobjs.delete(obj.key);
  }

  Unload(){
    Log("UNLOAD " + this.name);
    this.onUnload(this);
    for(let [key, gameobj] of this.gameobjs){
      gameobj.Destroy();
    }
    for(let [key, gameobj] of this.staticGameobjs){
      gameobj.Destroy();
    }
  }

  GetObjectsInBoundaries(position){
    var objList = [];
    for(var [key,value] of this.gameobjs){
      if(!value.camera && value.transform.IsInsideBoundaries(position)){
        objList.push(value);
      }
    }
    for(var [key,value] of this.staticGameobjs){
      if(!value.camera && value.transform.IsInsideBoundaries(position)){
        objList.push(value);
      }
    }
    return objList;
  }

  LoadByteCode(){
    Log("Loading bytecode of " + this.name);

    var lines = this.bytecode.match(/[^\r\n]+/g);
    var elements;
    var func;
    var pos;
    var height;
    var scaleX;
    var scaleY;
    var scale;
    var type;
    if(!lines) return;
    for(var line of lines){
      elements = line.split(' ');
      if(elements[0] === '-') continue;
      //func = prefabMapper.get(elements[0]);
      type = elements[0];
      if(prefabFactory.HasPrototype(elements[0])){
        pos = elements[1] && elements[2] ? new Vec2(elements[1], elements[2]) : new Vec2();
        height = elements[3] ? parseFloat(elements[3]) : 0.0;
        scaleX = elements[4] ? elements[4] : null;
        scaleY = elements[5] ? elements[5] : null;

        scale = scaleX == null || scaleY == null ? null : new Vec2(scaleX, scaleY);

        prefabFactory.CreateObj(type, pos, height, scale);
        //func(pos, height, new Vec2(scaleX, scaleY));
      }
    }
    Log("LOAD " +this.name);
    this.onLoad(this);
    Log(this);
  }

  RemoveObjFromBytecode(obj){
    var lines = this.bytecode.match(/[^\r\n]+/g);
    var found = false;
    let i = 0;
    while(i < lines.length && !found){
      if(lines[i] === obj.bytecode){
        found = true;
        lines.splice(i, 1);
      }
      i+=1;
    }
    this.bytecode = lines.join('\n');
    Log("FOUND?: " +found);
    return found;
  }

  AddObjToBytecode(obj){
    let str = obj.bytecode;
    this.bytecode+=("\n"+str);
  }

  CleanByteCode(){
    if(this.bytecode){
      this.bytecode = this.bytecode.match(/[^\r\n]+/g).join('\n');
    }
  }
}
