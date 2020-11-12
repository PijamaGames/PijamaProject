class Spawner extends Component{
  constructor(prefab, count){
    super();
    this.type = "spawner";
    this.coolDown = 3.0;
    this.time = 0.0;
    this.distToSpawn = 5.0;
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
        this.Spawn();
      }
    } else {
      this.time += manager.delta;
    }
  }

  InDistance(){
    let player = this.gameobj.scene.players.values().next().value;
    if(!player || player == null) return false;
    return Vec2.Distance(player.transform.GetWorldCenter(), this.gameobj.transform.GetWorldCenter()) < this.distToSpawn;
  }

  EndSpawn(){
    this.onEndSpawn(this.gameobj);
    this.gameobj.Destroy();
  }

  Spawn(){
    Log("spawn");
    prefabFactory.CreateObj("MonkeyEnemy", this.gameobj.transform.GetWorldCenter());
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
