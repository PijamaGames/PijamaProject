class Scene{
  constructor(name, bytecode = null){
    Object.assign(this, {name, bytecode});
    this.CleanByteCode();
    this.gameobjs = new Map();
    this.staticGameobjs = new Map();
    this.colliderGroups= [];
    this.rigidbodies = new Set();
    manager.scenes.set(this.name, this);
    this.camera = /*this.AddGameobj(*/new Gameobj('camera',0, null, this, [
      new Camera(),
      //new DebugController(10),
    ], new Transform(new Vec2(0,0), 0.0, new Vec2(canvas.width/tileSize, canvas.height/tileSize)));
  }

  Update(){
    for(let [key, gameobj] of this.gameobjs){
      gameobj.Update();
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
      if(!value.camera && value.IsInsideBoundaries(position)){
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
    if(!lines) return;
    for(var line of lines){
      elements = line.split(' ');
      if(elements[0] === '-') continue;
      func = prefabMapper.get(elements[0]);
      if(func){
        if(elements[1] && elements[2])
          pos = new Vec2(elements[1], elements[2]);
        else
          pos = new Vec2();

        if(elements[3])
          height = parseFloat(elements[3]);
        else
          height = 0.0;

        func(pos, height);
      }
    }
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
    return found;
  }

  CleanByteCode(){
    if(this.bytecode){
      this.bytecode = this.bytecode.match(/[^\r\n]+/g).join('\n');
    }
  }
}
