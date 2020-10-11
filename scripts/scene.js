class Scene{
  constructor(name, bytecode = null){
    Object.assign(this, {name, bytecode});
    this.gameobjs = new Map();
    this.staticGameobjs = new Map();
    this.colliderGroups= new Set();
    manager.scenes.set(this.name, this);
    this.camera = /*this.AddGameobj(*/new Gameobj('camera', null, this, [
      new Camera(),
      new DebugController(10),
    ], new Transform(new Vec2(0,0)));
  }

  Update(){
    for(let [key, gameobj] of this.gameobjs){
      gameobj.Update();
    }
  }

  AddGameobj(gameobj) {
    this.gameobjs.set(gameobj.name, gameobj);
    return gameobj;
  }

  AddStaticGameobj(gameobj){
    this.staticGameobjs.set(gameobj.name, gameobj);
    return gameobj;
  }

  RemoveGameobj(name){
    this.gameobjs.delete(name);
  }

  Unload(){
    for(let [key, gameobj] of this.gameobjs){
      gameobj.Destroy();
    }
    for(let [key, gameobj] of this.staticGameobjs){
      gameobj.Destroy();
    }
  }

  LoadByteCode(){
    Log("Loading bytecode of " + this.name);
    var lines = this.bytecode.match(/[^\r\n]+/g);
    var elements;
    var func;
    var pos;
    var height;
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
}
