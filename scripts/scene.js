class Scene{
  constructor(name){
    Object.assign(this, {name});
    this.gameobjs = new Map();
    this.staticGameobjs = new Map();
    manager.scenes.set(this.name, this);
    this.camera = /*this.AddGameobj(*/new Gameobj('camera', null, this, [
      new Camera(),
      new DebugController(),
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
}
