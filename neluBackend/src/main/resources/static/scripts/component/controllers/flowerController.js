class FlowerController extends Component {
  constructor(coolDown, oneUse = false){
    super();
    this.type = "flowerController";
    this.onPickUp = function(){};
    this.used = false;
    this.coolDown = coolDown;
    this.time = 0.0;
    this.oneUse = oneUse;
  }

  get player(){
    return this.gameobj.scene.players.values().next().value;
  }

  Update(){
    if(this.used && !this.oneUse){
      this.time += manager.delta;
      //Log("time: " + this.time + " of: " + this.coolDown);
      if(this.time > this.coolDown){
        this.used = false;
        this.gameobj.interactive.avaible = true;
        this.gameobj.renderer.tile.x -= 1;
      }
    }
  }

  PickUp(){
    if(!this.used){
      this.onPickUp(this.gameobj);
      this.time = 0.0;
      this.used = true;
      this.gameobj.renderer.tile.x += 1;
    }
  }

  SetOnPickUp(func){
    this.onPickUp = func;
    return this;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.flowerController = this;
  }
}
