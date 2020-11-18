class EnemyController extends Component {
  constructor(speed = 3.0) {

    super();
    this.type = "enemyController";
    this.speed=speed;
    this.endattackADAnim=false;
    this.shortestWay=[];

    this.moveAxis = new Vec2();
    this.rawMoveAxis = new Vec2();
    this.lerpMoveAxis = 10.0;

    this.lastPlayerPos = new Vec2();

    this.detectionRange = 9.0;
    this.attackADRange = 4.0;
    this.attackCACRange = 1.3;
    this.target = null;

    this.resetADAttackTime=2.0;
    this.resetCACAttackTime=1.5;
    this.contTimeAD=2.0;
    this.contTimeCAC=1.5;
    this.endAttackCACAnim=false;
    this.endAttackADAnim=false;

    this.attackADAnim='monkey_AD';
    this.attackCACAnim='monkey_CAC';
    this.idleAnim='monkey_idle';
    this.dieAnim='monkey_die';
    this.runAnim='monkey_run';

    this.attackADDamage=4;
    this.attackCACDamage=2.5;
    this.maxMissiles=3;
    this.pool = [];
    this.allApples = [];
    this.missileHeight=1;

    this.life=15;
    this.canTakeDamage = true;
    this.damageCooldown = 0.2;
    this.damageTime = 0.0;
    this.damageForce = 3.0;

    this.isMonkey=true;

    this.aproachFPS=14;

    this.onDeadCallBack = function(){};
    //this.onDeadEvent = new EventDispatcher();

  }

  PlayMonkeySound(sound){
    this.gameobj.audioSource.Play(sound);
  }
  PauseMonkeySound(sound){
    this.gameobj.audioSource.Pause(sound);
  }

  Push(){
    let force = Vec2.Scale(this.gameobj.renderer.dir, - this.damageForce);
    this.gameobj.rigidbody.force.Set(force.x, force.y);
  }

  TakeDamage(damage, forced = false){
    if(user && user.isClient) return;
    if(this.canTakeDamage || forced){
      if (this.isMonkey) this.PlayMonkeySound("monkeyDamageSound");
      else{
        this.gameobj.audioSource.Loop("beekeeperDied",false);
        this.gameobj.audioSource.Play("beekeeperDied");

      }
      this.life -= damage;
      this.canTakeDamage = false;
      this.gameobj.renderer.SetTint(1.0,0.0,0.0);
      this.damageTime = 0.0;
      /*if(this.life > 0){
        setTimeout(()=>{
          this.canTakeDamage = true;
          this.gameobj.renderer.SetTint(1,1,1);
        }, this.damageCooldown*1000);
      }*/
    }
  }

  Update(){
    if(user && user.isClient) return;
    this.enemyFSM.Update();
    this.contTimeAD+=manager.delta;
    this.contTimeCAC+=manager.delta;

    if(!this.canTakeDamage && this.life > 0){
      this.damageTime+=manager.delta;
      if(this.damageTime > this.damageCooldown){
        this.canTakeDamage = true;
        this.gameobj.renderer.SetTint(1,1,1);
      }
    }
  }

  FindClosestPlayer(range){
    let minDist = range;
    let dist;
    let target=null;
    let wp = this.gameobj.transform.GetWorldPos();
    for(var player of this.gameobj.scene.players){
      dist = Vec2.Sub(player.transform.GetWorldPos(), wp).mod;
      if(dist < minDist){
        target = player;
        this.target=target;
        minDist = dist;
      }
    }
    return target;
  }

  CheckShortestWay(){
    let target=this.FindClosestPlayer(this.detectionRange);
    if(target == null) this.rawMoveAxis.Set(0,0);
    else{
      this.rawMoveAxis = Vec2.Sub(
        target.transform.position,
        this.gameobj.transform.GetWorldPos()
      ).Norm();
    }

    let axisDir = Vec2.Sub(this.rawMoveAxis, this.moveAxis);
    this.moveAxis.Add(axisDir.Scale(this.lerpMoveAxis*manager.delta));
  }

  EnemyMove() {
    let axis = this.moveAxis.Copy();

    this.gameobj.renderer.SetDirection(axis);

    let movement = axis.Scale(this.speed);
    this.gameobj.rigidbody.force.Add(movement);
  }

  CreateFSM(){
    var that = this;

    let patrolNode = new Node('patrol').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyIdle', this.idleAnim, 5);
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyIdle');
    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.detectionRange)!=null && this.target.playerController.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
    ]);

    let rechargeNode = new Node('recharge').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyIdle', this.idleAnim, 5);
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyIdle');
    }).SetEdges([
      new Edge('attackAD').AddCondition(()=>that.contTimeAD>=that.resetADAttackTime && that.FindClosestPlayer(that.attackADRange) != null && that.FindClosestPlayer(that.attackCACRange) == null && (!manager.easy || (user && user.isHost))  && that.life>0),
      new Edge('attackCAC').AddCondition(()=>that.contTimeCAC>=that.resetCACAttackTime && that.FindClosestPlayer(that.attackCACRange) != null  && that.life>0),
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) == null && that.FindClosestPlayer(that.detectionRange) != null && that.FindClosestPlayer(that.attackCACRange) == null  && that.life>0),
      new Edge('patrol').AddCondition(()=>that.target.playerController.life<0 && that.life>0),
      new Edge('dead').AddCondition(()=>that.life<=0),

    ]);

    let approachPlayerNode = new Node('approachPlayer').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyRun', this.runAnim, this.aproachFPS);

    }).SetStartFunc(()=>{
      that.CheckShortestWay();
      that.gameobj.renderer.SetAnimation('enemyRun');
      if (that.isMonkey) that.PlayMonkeySound("screamingMonkeySound");


    }).SetUpdateFunc(()=>{
      that.CheckShortestWay();
      that.EnemyMove();

    }).SetExitFunc(()=>{
      if (that.isMonkey) that.PauseMonkeySound("screamingMonkeySound");

    }).SetEdges([
      new Edge('patrol').AddCondition(()=> that.FindClosestPlayer(that.detectionRange) == null || that.target.playerController.life<=0  && that.life>0),
      new Edge('attackAD').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) != null && this.target.playerController.life>0 && (!manager.easy || (user && user.isHost))  && that.life>0),
      new Edge('attackCAC').AddCondition(()=>that.FindClosestPlayer(that.attackCACRange) != null && this.target.playerController.life>0 && that.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
    ]);

    let attackADNode = new Node('attackAD').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyattackAD', this.attackADAnim, 14, false);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackAD');
      that.endAttackADAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackADAnim=true,true);
      this.contTimeAD=this.resetADAttackTime;
      if(!this.isMonkey){
        this.PlayMonkeySound("beekeeperAttack");
        this.gameobj.audioSource.LoopAll(true);
      }
    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);
      this.SetAnimDir(target);
      if(this.contTimeAD>=this.resetADAttackTime && target != null){
        if(this.isMonkey) this.PlayMonkeySound("throwMissileSound");
        this.PoolPop(target);
        this.contTimeAD=0;
      }

    }).SetExitFunc(()=>{
        if(!this.isMonkey)this.PauseMonkeySound("beekeeperAttack");

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>(that.FindClosestPlayer(that.attackADRange) == null || that.target.playerController.life<=0) && (that.endAttackADAnim || that.FindClosestPlayer(that.detectionRange) != null) && that.life>0),
      new Edge('attackCAC').AddCondition(()=>that.FindClosestPlayer(that.attackCACRange) != null && this.target.playerController.life>0 && that.endAttackADAnim  && that.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
      new Edge('recharge').AddCondition(()=> that.contTimeAD<that.resetADAttackTime && that.endAttackADAnim && that.isMonkey && that.life>0),
    ]);

    let attackCACNode = new Node('attackCAC').SetOnCreate(()=>{

      that.gameobj.renderer.AddAnimation('enemyattackCAC', this.attackCACAnim, 20);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackCAC');
      that.endAttackCACAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackCACAnim=true,true);
      this.contTimeCAC=this.resetCACAttackTime;

    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);
      this.SetAnimDir(target);
      if(target!=null && this.contTimeCAC>=this.resetCACAttackTime){
        target.playerController.TakeDamage(that.attackCACDamage);
        this.contTimeCAC=0;
      }

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>(that.FindClosestPlayer(that.attackCACRange) == null || that.target.playerController.life<0) && (that.endAttackCACAnim || that.FindClosestPlayer(that.detectionRange) != null || manager.easy) && that.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
      new Edge('recharge').AddCondition(()=> that.contTimeCAC<that.resetCACAttackTime && that.endAttackCACAnim && !manager.easy && that.life>0),

    ]);

    let deadNode = new Node('dead').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyDead', this.dieAnim, 14);
    }).SetStartFunc(()=>{
      that.PlayMonkeySound("beekeeperDied");
      that.gameobj.renderer.SetAnimation('enemyDead');
      that.gameobj.renderer.endAnimEvent.AddListener(this, ()=>that.gameobj.Destroy(), true);
      that.onDeadCallBack();
    });

    this.enemyFSM = new FSM([patrolNode, approachPlayerNode, attackADNode, attackCACNode, rechargeNode, deadNode]).Start('patrol');
  }

  CreatePool(){
    let obj;
    for (var i = 0; i < this.maxMissiles; i++) {
      obj = prefabFactory.CreateObj('apple', new Vec2(), this.missileHeight);
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
      obj.transform.SetWorldPosition(this.gameobj.transform.GetWorldFloor().Copy());

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
    //this.onDeadEvent.Dispatch();
    this.gameobj.scene.enemies.delete(this.gameobj);
    this.gameobj.audioSource.Stop("beekeeperDied");
    for(let apple of this.allApples){
      apple.Destroy();
    }
    this.gameobj.audioSource.StopAll();
  }

  SetAnimDir(target) {
    if(target!=null) {
      let axis = Vec2.Sub(target.transform.GetWorldCenter().Copy(), this.gameobj.transform.GetWorldCenter().Copy());
      this.gameobj.renderer.SetDirection(axis);
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();
    this.CreatePool();
    manager.scene.enemies.add(this.gameobj);
  }
}
