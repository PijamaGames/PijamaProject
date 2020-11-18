class BeekeeperController extends EnemyController {
  constructor(speed = 3.0) {

    super(speed);
    this.type = "beekeeperController";

    this.detectionRange = 10.0;
    this.attackADRange = 3.5;
    this.attackCACRange = 1.3;

    this.resetADAttackTime=0.15;
    this.resetCACAttackTime=1;
    this.contTimeAD=0.15;
    this.contTimeCAC=1;

    this.attackADAnim='beekeeper_AD';
    this.attackCACAnim='beekeeper_CAC';
    this.idleAnim='beekeeper_idle';
    this.dieAnim='beekeeper_die';
    this.runAnim='beekeeper_run';

    this.attackCACDamage=5;
    this.maxParticles=7;
    this.pool = [];
    this.allParticles = [];

    this.aproachFPS=14;

    this.isMonkey=false;

    this.life=25;
  }

  CreatePool(){
    let obj;
    for (var i = 0; i < this.maxParticles; i++) {
      obj = prefabFactory.CreateObj('particle', new Vec2(), this.missileHeight);
      obj.SetActive(false);
      obj.particlesController.enemy=this.gameobj;
      this.pool.push(obj);
      this.allParticles.push(obj);
    }
  }

  PoolPop(target) {
    let obj;
    if(this.pool.length>0){
      obj=this.pool.pop();
      obj.SetActive(true);
      obj.transform.SetWorldPosition(this.gameobj.transform.GetWorldFloor().Copy());

      obj.particlesController.MissileMove(obj,target);
      obj.particlesController.startCoolDown=true;
    }
  }

  PoolAdd(obj) {
    this.pool.push(obj);
    obj.SetActive(false);
    obj.particlesController.contTime=0
    obj.particlesController.startCoolDown=false;
  }

  SetScene(scene){
    this.gameobj.scene.enemies.delete(this.gameobj);
    scene.enemies.add(this.gameobj);
  }

  Destroy(){
    
    this.gameobj.audioSource.Stop("beekeeperDied");
    this.gameobj.scene.enemies.delete(this.gameobj);
    for(let particle of this.allParticles){
      particle.Destroy();
    }
    this.gameobj.audioSource.StopAll();
  }

}
