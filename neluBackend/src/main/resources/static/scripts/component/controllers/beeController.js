class BeeController extends Component{
  constructor(){
    super();
    //this.target = null;
    this.type = "beeController";
    this.speed = 2.0;
    this.randomNess = 7.0;
    this.player = null;
    this.randomVec = new Vec2();
    this.threshold = 0.3;
    this.lifeTime = 0.0;
    this.maxLifeTime = 5.0;
    this.damage = 2.5;
  }

  get target(){
    return this.player.playerController.beesTarget;
  }

  Update(){
    if(user && user.isClient) return;
    this.lifeTime += manager.delta;

    let target = this.target;
    if(target == null){
      let distToPlayer = Vec2.Sub(this.gameobj.transform.GetWorldPos(), this.player.transform.GetWorldFloor()).mod;
      if(distToPlayer >  this.threshold){
        target = this.player;
      }

    }

    if(this.lifeTime > this.maxLifeTime || !target || target == null || target.scene != this.gameobj.scene){ //If not target or maxLife
      if(this.player){
        this.player.playerController.BeePoolAdd(this.gameobj);
      }
    } else {
      let dir = Vec2.Sub(target.transform.GetWorldFloor(), this.gameobj.transform.GetWorldPos());
      if(dir.mod < this.threshold && target.enemyController){
        //TARGET GETS DAMAGE
        if(target.enemyController.canTakeDamage){
          target.enemyController.TakeDamage(this.damage);
          if(this.player != null){
            this.player.playerController.BeePoolAdd(this.gameobj);
          }
        }

      } else {
        let force = dir;
        force.Norm().Scale(this.speed);
        this.randomVec.Set(Math.random()-0.5, Math.random()-0.5);
        this.randomVec.Scale(this.randomNess);
        force.Add(this.randomVec);
        this.gameobj.rigidbody.force.Add(force);
        this.gameobj.renderer.SetDirection(this.gameobj.rigidbody.velocity);
      }
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.beeController = this;
  }

  /*SetTarget(enemy){
    this.target = enemy;
  }*/
}
