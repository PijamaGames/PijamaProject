class PlayerController extends Component {
  constructor(speed = 3.0) {

    super();
    this.type = "playerController";
    this.speed = speed;
    this.leftAxis = new Vec2();
  }

  Update(){
    this.leftAxis = this.GetLeftAxis();
    this.playerFSM.Update();
  }

  GetLeftAxis(){
    let axis;

    if(input.isDesktop){
      axis = new Vec2();
      axis.x -= input.GetKeyPressed('KeyA') || input.GetKeyPressed('ArrowLeft') ? 1.0 : 0.0;
      axis.x += input.GetKeyPressed('KeyD') || input.GetKeyPressed('ArrowRight') ? 1.0 : 0.0;

      axis.y -= input.GetKeyPressed('KeyS') || input.GetKeyPressed('ArrowDown') ? 1.0 : 0.0;
      axis.y += input.GetKeyPressed('KeyW') || input.GetKeyPressed('ArrowUp') ? 1.0 : 0.0;
      axis.Norm();
    } else {
      let virtualDir = input.GetVirtualJoystick('leftJoystick');
      let joystickDown = input.GetVirtualButtonPressed('leftJoystick')
      axis = virtualDir.mod > 0.1 && joystickDown ? Vec2.Norm(virtualDir) : new Vec2();
    }
    return axis;
  }

  PlayerMove() {
    let axis = this.leftAxis.Copy();

    this.gameobj.renderer.SetDirection(axis);

    let movement = axis.Scale(this.speed);
    this.gameobj.rigidbody.force.Add(movement);
  }

  CreateFSM(){
    var that = this;

    let idleNode = new Node('idle').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('idle', 'nelu_idle', 5);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('idle');

    }).SetEdges([
      new Edge('run').AddCondition(()=>{
        return that.leftAxis.mod > 0.05;
        //Left axis used
      }),
    ]);

    let runNode = new Node('run').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('run', 'nelu_run', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('run');

    }).SetUpdateFunc(()=>{
      that.PlayerMove();

    }).SetEdges([
      new Edge('idle').AddCondition(()=>{
        //Left axis not used
        return that.leftAxis.mod < 0.05;
      }),
    ]);

    this.playerFSM = new FSM([idleNode, runNode/*, this.dash, this.attack*/]).Start('idle');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.playerController = this;
    this.CreateFSM();
  }

}
