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

    this.detectionRange = 8.0;
    this.attackADRange = 4.0;
    this.attackCACRange = 1.5;
    this.target = null;

    this.resetADAttackTime=5;
    this.resetCACAttackTime=1;
    this.contTimeAD=5;
    this.contTimeCAC=1;
    this.endAttackCACAnim=false;
    this.endAttackADAnim=false;

    this.attackADDamage=5;
    this.attackCACDamage=1;
    this.maxMissiles=5;

    this.life=15;
  }

  Update(){
    this.enemyFSM.Update();
    this.contTimeAD+=manager.delta;
    this.contTimeCAC+=manager.delta;
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
      that.gameobj.renderer.AddAnimation('enemyIdle', 'nelu_idle', 5);
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyIdle');
    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.detectionRange)!=null && this.target.playerController.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
    ]);

    let rechargeNode = new Node('recharge').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyIdle', 'nelu_idle', 5);
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyIdle');
    }).SetEdges([
      new Edge('attackAD').AddCondition(()=>that.contTimeAD>=that.resetADAttackTime && that.FindClosestPlayer(that.attackADRange) != null && that.FindClosestPlayer(that.attackCACRange) == null),
      new Edge('attackCAC').AddCondition(()=>that.contTimeCAC>=that.resetCACAttackTime && that.FindClosestPlayer(that.attackCACRange) != null),
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) == null && that.FindClosestPlayer(that.detectionRange) != null && that.FindClosestPlayer(that.attackCACRange) == null),
      new Edge('patrol').AddCondition(()=>that.target.playerController.life<0),

    ]);

    let approachPlayerNode = new Node('approachPlayer').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyRun', 'nelu_run', 14);

    }).SetStartFunc(()=>{
      that.CheckShortestWay();
      that.gameobj.renderer.SetAnimation('enemyRun');

    }).SetUpdateFunc(()=>{
      that.CheckShortestWay();
      that.EnemyMove();

    }).SetEdges([
      new Edge('patrol').AddCondition(()=> that.FindClosestPlayer(that.detectionRange) == null || that.target.playerController.life<0),
      new Edge('attackAD').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) != null && this.target.playerController.life>0),
      new Edge('dead').AddCondition(()=> that.life<=0),
    ]);

    let attackADNode = new Node('attackAD').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyattackAD', 'nelu_attack1', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackAD');
      that.endAttackADAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackADAnim=true,true);

    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);

      if(target!=null && this.contTimeAD>=this.resetADAttackTime && this.pool.length>0){
        let obj=this.PoolPop();
        obj.appleController.MissileMove(obj,target);
        obj.appleController.startCoolDown=true;
        this.contTimeAD=0;
      }

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer((that.attackADRange) == null || that.target.playerController.life<0) && that.endAttackADAnim),
      new Edge('attackCAC').AddCondition(()=>that.FindClosestPlayer(that.attackCACRange) != null && this.target.playerController.life>0 && that.endAttackADAnim),
      new Edge('dead').AddCondition(()=> that.life<=0 && that.endAttackADAnim),
      new Edge('recharge').AddCondition(()=> that.contTimeAD<that.resetADAttackTime && that.endAttackADAnim),
    ]);

    let attackCACNode = new Node('attackCAC').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyattackCAC', 'nelu_idle', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackCAC');
      that.endAttackCACAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackCACAnim=true,true);

    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);

      if(target!=null && this.contTimeCAC>=this.resetCACAttackTime){
        target.playerController.TakeDamage(that.attackCACDamage);
        this.contTimeCAC=0;
      }

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer((that.attackCACRange) == null || that.target.playerController.life<0) && that.endAttackCACAnim),
      new Edge('dead').AddCondition(()=> that.life<=0 && that.endAttackCACAnim),
      new Edge('recharge').AddCondition(()=> that.contTimeCAC<that.resetCACAttackTime && that.endAttackCACAnim),

    ]);

    let deadNode = new Node('dead').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyDead', 'nelu_run', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyDead');
    });

    this.enemyFSM = new FSM([patrolNode, approachPlayerNode, attackADNode, attackCACNode, rechargeNode, deadNode]).Start('patrol');
  }

  CreatePool(){
    this.pool = [];
    let size = this.maxMissiles;
    let obj;
    for (var i = 0; i < size; i++) {
      obj = prefabFactory.CreateObj('apple');
      obj.enemyController=this;
      obj.SetActive(false);
      this.pool.push(obj);
    }
  }

  PoolPop() {
    let obj = this.pool.pop();
    obj.transform.SetWorldPosition(this.gameobj.transform.GetWorldPos().Copy());
    obj.SetActive(true);
    return obj;
  }

  PoolAdd(obj) {
    if (obj) {
      obj.SetActive(false);
      this.pool.push(obj);
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();
    this.gameobj.renderer.SetTint(1.0,0.5,0.5);
    this.CreatePool();
  }
}
