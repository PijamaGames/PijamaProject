class BeekeeperController extends EnemyController {
  constructor(speed = 3.0) {

    super();
    this.type = "beekeeperController";

    this.detectionRange = 10.0;
    this.attackADRange = 3.0;
    this.attackCACRange = 1.5;

    this.resetADAttackTime=0.1;//ME PREOCUPA
    this.resetCACAttackTime=1;
    this.contTimeAD=0.1;
    this.contTimeCAC=1;

    this.attackADAnim='beekeeper_AD';
    this.attackCACAnim='beekeeper_CAC';
    this.idleAnim='beekeeper_idle';
    this.dieAnim='beekeeper_die';
    this.runAnim='beekeeper_run';

    this.attackCACDamage=5;
    this.maxParticles=10;
    this.pool = [];
    this.allParticles = [];

    this.life=25;
  }

  CreatePool(){
    let obj;
    for (var i = 0; i < this.maxParticles; i++) {
      obj = prefabFactory.CreateObj('particle', new Vec2(), 1);
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
      obj.transform.SetWorldPosition(this.gameobj.transform.GetWorldCenter().Copy());

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
    this.gameobj.scene.enemies.delete(this.gameobj);
    for(let apple of this.allParticles){
      apple.Destroy();
    }
  }

}
