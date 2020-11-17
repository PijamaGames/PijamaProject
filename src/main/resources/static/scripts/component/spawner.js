class Spawner extends Component{

  //static refs = new Map();
  static enemyCount = 0;

  constructor(prefab, count, cooldown = 3.0){
    super();
    this.type = "spawner";
    this.coolDown = 3.0;
    this.time = this.coolDown*0.7;
    this.distToSpawn = 100.0;
    this.count = count;
    this.onEndSpawn = function(){};
    this.spawnEvent = new EventDispatcher();
    this.endSpawnEvent = new EventDispatcher();
    this.ended = false;
    this.started = false;
    this.spawnedAlive = false;
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
    if(this.spawnedAlive) return;
    if(this.count <= 0) return;
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
    this.time = 0.0;
    this.count-=1;
    this.spawnedAlive = true;
    this.spawnEvent.Dispatch();
    let obj = prefabFactory.CreateObj("MonkeyEnemy", this.gameobj.transform.GetWorldCenter());
    obj.enemyController.detectionRange = 18.0;
    var that = this;
    obj.enemyController.onDeadCallBack = ()=>{
      //Spawner.enemyCount-=1;
      that.spawnedAlive = false;
      if(that.count <= 0){
        that.EndSpawn();
      }
    }



    /*if(this.count <= 0){
      this.EndSpawn();
    }*/
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.spawner = this;
    //Spawner.refs.add(this.key, this);
  }
}
