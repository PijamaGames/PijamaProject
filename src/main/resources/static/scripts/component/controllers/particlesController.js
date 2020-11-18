class ParticlesController extends Component{
  constructor(){
    super();
    this.type = "particlesController";

    this.timeLimit=1;
    this.particleImpulse=2.0;
    this.startCoolDown=false;
    this.contTime=0;
    this.damageDist = 0.3;
    this.damage = 2.5;
  }

  Update(){
    if(this.startCoolDown){
      this.contTime+=manager.delta;
    }
    if(this.gameobj.active && this.contTime>=this.timeLimit){
      this.gameobj.SetActive(false);
      if(this.enemy){
        this.enemy.enemyController.PoolAdd(this.gameobj);
      } else {
        this.gameobj.Destroy();
      }

      //this.startCoolDown=false;
      //this.contTime=0;
    }
    let player = manager.scene.players.values().next().value;
    if(player && player!=null){
      let dist = Vec2.Distance(this.gameobj.transform.GetWorldPos(), player.transform.GetWorldFloor());
      if(dist <= this.damageDist){
        player.playerController.TakeDamage(this.damage);
        if(this.enemy){
          this.enemy.enemyController.PoolAdd(this.gameobj);
        } else {
          this.gameobj.Destroy();
        }

      }
    }
  }

  MissileMove(missile,target) {
    let axis = Vec2.Sub(target.transform.GetWorldFloor().Copy(), missile.transform.GetWorldCenter().Copy());
    let movement = axis.Scale(this.particleImpulse);
    missile.rigidbody.force.Add(movement);
  }
  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.particlesController = this;
  }

}
