class Spawner extends Component{

  //static refs = new Map();

  constructor(prefab, count){
    super();
    this.type = "spawner";
    this.coolDown = 3.0;
    this.time = 0.0;
    this.distToSpawn = 5.0;
    this.count = count;
    this.onEndSpawn = function(){};
    this.spawnEvent = new EventDispatcher();
    this.endSpawnEvent = new EventDispatcher();
    this.ended = false;
    this.started = false;
  }

  /*get key(){
    let wp = this.gameobj.transform.GetWorldPos();
    return ""+wp.x+" "+wp.y;
  }*/

  SetOnEndSpawn(func){
    this.onEndSpawn = func;
    return this;
  }

  Update(){
    if(this.ended) return;
    if(!this.started) return;
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
    this.endSpawnEvent.Dispatch();
    this.onEndSpawn(this.gameobj);
    //Spawner.refs.delete(this.key, this);
    this.ended = true;
    //this.gameobj.Destroy();
  }

  Spawn(){
    Log("spawn");
    this.spawnEvent.Dispatch();
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
    //Spawner.refs.add(this.key, this);
  }
}
