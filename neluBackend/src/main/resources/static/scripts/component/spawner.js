class Spawner extends Component{
  constructor(prefab, count){
    super();
    this.coolDown = 3.0;
    this.time = 0.0;
    this.distToSpawn = 10.0;
    this.count = count;
    this.onEndSpawn = function(){};
  }

  SetOnEndSpawn(func){
    this.onEndSpawn = func;
    return this;
  }

  Update(){
    if(this.time >= this.coolDown){
      if(this.InDistance()){

      }
    } else {
      this.time += manager.delta;
    }
  }

  InDistance(){
    let player = this.gameobj.scene.players.values().next().value;
    return Vec2.Distance(player.transform.GetWorldCenter(), this.gameobj.transform.GetWorldCenter()) < this.distToSpawn;
  }

  EndSpawn(){
    this.onEndSpawn(this.gameobj);
    this.gameobj.Destroy();
  }

  Spawn(){
    this.time = 0.0;
    this.count-=1;


    if(this.count <= 0){
      this.EndSpawn();
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.spawner = this;
  }
}
