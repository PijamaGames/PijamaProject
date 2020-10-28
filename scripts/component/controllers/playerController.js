class PlayerController extends Component {
  constructor(speed = 3.0, camOffset = 3.0) {

    super();
    this.type = "playerController";
    this.speed = speed;
    this.camOffset = camOffset;
    this.leftAxis = new Vec2();
    this.rawLeftAxis = new Vec2();
    this.lerpLeftAxis = 10.0;
    this.endAttackAnim=false;
  }

  Update(){
    let leftAxis = this.GetLeftAxis();
    this.rawLeftAxis.Set(leftAxis.x, leftAxis.y);
    let axisDir = Vec2.Sub(leftAxis, this.leftAxis);
    this.leftAxis.Add(axisDir.Scale(this.lerpLeftAxis*manager.delta));


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
      //Log(virtualDir.mod);
      let joystickDown = input.GetVirtualButtonPressed('leftJoystick')
      axis = joystickDown ? Vec2.Norm(virtualDir) : new Vec2();
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
      manager.scene.camera.transform.SetWorldPosition(that.gameobj.transform.GetWorldCenter().Copy());
    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('idle');
      manager.scene.camera.camera.target = that.gameobj.transform.GetWorldCenter().Copy();
    }).SetEdges([
      new Edge('run').AddCondition(()=>{
        return that.rawLeftAxis.mod > 0.05;
        //Left axis used
      }),
      new Edge('attack').AddCondition(()=>{
        //Left axis not used
        return input.mouseLeftDown;
      }),
    ]);

    let runNode = new Node('run').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('run', 'nelu_run', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('run');

    }).SetUpdateFunc(()=>{
      that.PlayerMove();
      let camTarget = that.gameobj.transform.GetWorldCenter().Copy().Add(Vec2.Scale(that.leftAxis, that.camOffset));
      manager.scene.camera.camera.target = camTarget;

    }).SetEdges([
      new Edge('idle').AddCondition(()=>{
        //Left axis not used
        return that.rawLeftAxis.mod < 0.05;
      }),
      new Edge('attack').AddCondition(()=>{
        //Left axis not used
        return input.mouseLeftDown;
      }),
    ]);

    let attackNode = new Node('attack').SetOnCreate(()=>{
      that.gameobj.renderer.AddAnimation('attack', 'nelu_attack', 14);

    }).SetStartFunc(()=>{
      that.gameobj.renderer.SetAnimation('attack');
      that.endAttackAnim=false;
      that.gameobj.renderer.endAnimEvent.AddListener(that, ()=>that.endAttackAnim=true,true);

    }).SetUpdateFunc(()=>{
      //METER LO Q HACE MIENTRAS ATACA

    }).SetEdges([
      new Edge('idle').AddCondition(()=>{
        //Left axis not used
        return that.rawLeftAxis.mod < 0.05 && that.endAttackAnim;
      }),
      new Edge('run').AddCondition(()=>{
        return that.rawLeftAxis.mod > 0.05 && that.endAttackAnim;
        //Left axis used
      }),
    ]);

    this.playerFSM = new FSM([idleNode, runNode/*, this.dash*/, attackNode]).Start('idle');
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.playerController = this;
    this.CreateFSM();
  }

}
