class BeekeeperController extends EnemyController {
  constructor(speed = 3.0) {

    super();
    this.type = "beekeeperController";
    this.speed=speed;
    this.endattackADAnim=false;
    this.shortestWay=[];

    this.moveAxis = new Vec2();
    this.rawMoveAxis = new Vec2();
    this.lerpMoveAxis = 10.0;

    this.lastPlayerPos = new Vec2();

    this.detectionRange = 8.0;
    this.attackADRange = 4.0;
    this.attackCACRange = 1.5;
    this.target = null;

    this.resetADAttackTime=2;
    this.resetCACAttackTime=1;
    this.contTimeAD=2;
    this.contTimeCAC=1;
    this.endAttackCACAnim=false;
    this.endAttackADAnim=false;

    this.attackADAnim='monkey_AD';
    this.attackCACAnim='monkey_CAC';
    this.idleAnim='monkey_idle';
    this.dieAnim='monkey_die';
    this.runAnim='monkey_run';

    this.attackADDamage=5;
    this.attackCACDamage=1;
    this.maxMissiles=5;
    this.pool = [];
    this.allApples = [];

    this.life=15;
    this.canTakeDamage = true;
    this.damageCooldown = 0.5;
    this.damageForce = 10.0;
  }



  CreatePool(){
    let obj;
    for (var i = 0; i < this.maxMissiles; i++) {
      obj = prefabFactory.CreateObj('apple', new Vec2(), 1);
      obj.SetActive(false);
      obj.appleController.enemy=this.gameobj;
      this.pool.push(obj);
      this.allApples.push(obj);
    }
  }

  PoolPop(target) {
    let obj;
    if(this.pool.length>0){
      obj=this.pool.pop();
      obj.SetActive(true);
      obj.transform.SetWorldPosition(this.gameobj.transform.GetWorldCenter().Copy());

      obj.appleController.MissileMove(obj,target);
      obj.appleController.startCoolDown=true;
    }
  }

  PoolAdd(obj) {
    this.pool.push(obj);
    obj.SetActive(false);
    obj.appleController.contTime=0
    obj.appleController.startCoolDown=false;
  }

  SetScene(scene){
    this.gameobj.scene.enemies.delete(this.gameobj);
    scene.enemies.add(this.gameobj);
  }

  Destroy(){
    this.gameobj.scene.enemies.delete(this.gameobj);
    for(let apple of this.allApples){
      apple.Destroy();
    }
  }

  SetAnimDir(target){
    if(target!=null){
      let axis = Vec2.Sub(target.transform.GetWorldCenter().Copy(), this.gameobj.transform.GetWorldCenter().Copy());
      this.gameobj.renderer.SetDirection(axis);
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();
    this.gameobj.renderer.SetTint(1.0,0.5,0.5);
    this.CreatePool();
    manager.scene.enemies.add(this.gameobj);
  }
}
