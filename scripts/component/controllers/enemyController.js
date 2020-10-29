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
    this.contTimeAD=0;
    this.contTimeCAC=0;

    this.attackADDamage=5;
    this.attackCACDamage=1;

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
    this.target=null;
    let wp = this.gameobj.transform.GetWorldPos();
    for(var player of this.gameobj.scene.players){
      dist = Vec2.Sub(player.transform.GetWorldPos(), wp).mod;
      if(dist < minDist){
        this.target = player;
        minDist = dist;
      }
    }
    return this.target;
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
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.detectionRange)!=null),
      /*new Edge('attackAD').AddCondition(()=>{

      }),*/
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
      new Edge('patrol').AddCondition(()=> that.FindClosestPlayer(that.detectionRange) == null),
      new Edge('attackAD').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) != null),
    ]);

    let attackADNode = new Node('attackAD').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyattackAD', 'nelu_attack', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackAD');

    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);

      if(target!=null && this.contTimeAD>=this.resetADAttackTime){
        target.playerController.TakeDamage(that.attackADDamage); // AQUI  REALMENTE VA A TENER QUE LANZAR UN OBJETO EN VEZ DE HACER DAÑO
        this.contTimeAD=0;
        }


    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.attackADRange) == null),
      new Edge('attackCAC').AddCondition(()=>that.FindClosestPlayer(that.attackCACRange) != null),
    ]);

    let attackCACNode = new Node('attackCAC').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyattackCAC', 'nelu_idle', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyattackCAC');

    }).SetUpdateFunc(()=>{
      let target=that.FindClosestPlayer(that.attackADRange);

      if(target!=null && this.contTimeCAC>=this.resetCACAttackTime){
        target.playerController.TakeDamage(that.attackCACDamage);
        this.contTimeCAC=0;
      }

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.attackCACRange) == null),
    ]);

    let deadNode = new Node('dead').SetOnCreate(()=>{
      //that.gameobj.renderer.AddAnimation('enemyDead', 'enemy_dead', 14);

    }).SetStartFunc(()=>{
      //that.gameobj.renderer.SetAnimation('enemyDead');

    });

    this.enemyFSM = new FSM([patrolNode, approachPlayerNode, attackADNode, attackCACNode, deadNode]).Start('patrol');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();

    this.gameobj.renderer.SetTint(1.0,0.5,0.5);

  }

}
