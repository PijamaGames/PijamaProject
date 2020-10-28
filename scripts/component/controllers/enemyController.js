class EnemyController extends Component {
  constructor(speed = 3.0, camOffset = 3.0) {

    super();
    this.type = "enemyController";
    this.endAttackAnim=false;
  }

  Update(){
    this.playerFSM.Update();
  }

  ShortestWay(){

  }

  EnemyMove() {
    let axis = this.leftAxis.Copy();

    this.gameobj.renderer.SetDirection(axis);

    let movement = axis.Scale(this.speed);
    this.gameobj.rigidbody.force.Add(movement);
  }

  CreateFSM(){
    var that = this;

    let idleNode = new Node('enemyIdle').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyIdle', 'enemy_idle', 5);
      manager.scene.camera.transform.SetWorldPosition(that.gameobj.transform.GetWorldCenter().Copy());
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyIdle');
    }).SetEdges([
      new Edge('enemyRun').AddCondition(()=>{

      }),
      new Edge('enemyAttack').AddCondition(()=>{

      }),
    ]);

    let runNode = new Node('enemyRun').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyRun', 'enemy_run', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyRun');

    }).SetUpdateFunc(()=>{
      that.EnemyMove();

    }).SetEdges([
      new Edge('enemyIdle').AddCondition(()=>{

      }),
      new Edge('enemyAttack').AddCondition(()=>{

      }),
    ]);

    let attackNode = new Node('enemyAttack').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('enemyAttack', 'enemy_attack', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('enemyAttack');
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);

    }).SetUpdateFunc(()=>{
      //METER LO Q HACE MIENTRAS ATACA

    }).SetEdges([
      new Edge('enemyIdle').AddCondition(()=>{

      }),
      new Edge('enemyRun').AddCondition(()=>{

      }),
    ]);

    this.enemyFSM = new FSM([idleNode, runNode, attackNode]).Start('enemyIdle');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.enemyController = this;
    this.CreateFSM();
  }

}
