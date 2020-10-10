class Scene{
  constructor(name){
    Object.assign(this, {name});
    this.gameobjs = new Map();
    manager.scenes.set(this.name, this);
    this.camera = /*this.AddGameobj(*/new Gameobj('camera', null, this, [
      new Camera()
    ], new Transform(new Vec2(3,5)));
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

  RemoveGameobj(name){
    this.gameobjs.delete(name);
  }
}
