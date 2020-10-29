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
    this.bodyattackADRange = 1.5;
    this.target = null;
  }

  Update(){
    this.enemyFSM.Update();
  }

  FindClosestPlayer(range){
    let minDist = range;
    let dist;
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
    let target = this.FindClosestPlayer();

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
    //hay q meterle la direccion que toque calculada en shortestWay
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
      new Edge('attackAD').AddCondition(()=>that.FindClosestPlayer(that.attackRange) != null),
    ]);

    let attackADNode = new Node('attackAD').SetOnCreate(()=>{
      //that.gameobj.renderer.AddAnimation('enemyattackAD', 'enemy_attackAD', 14);

    }).SetStartFunc(()=>{
      //that.gameobj.renderer.SetAnimation('enemyattackAD');
      that.endattackADAnim=false;
      //that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endattackADAnim=true,true);

    }).SetUpdateFunc(()=>{
      //METER LO Q HACE MIENTRAS ATACA

    }).SetEdges([
      new Edge('approachPlayer').AddCondition(()=>that.FindClosestPlayer(that.attackRange) == null),
    ]);

    let deadNode = new Node('dead').SetOnCreate(()=>{
      //that.gameobj.renderer.AddAnimation('enemyDead', 'enemy_dead', 14);

    }).SetStartFunc(()=>{
      //that.gameobj.renderer.SetAnimation('enemyDead');

    });

    this.enemyFSM = new FSM([patrolNode, approachPlayerNode, attackADADNode, deadNode]).Start('patrol');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();

    this.gameobj.renderer.SetTint(1.0,0.5,0.5);

  }

}
