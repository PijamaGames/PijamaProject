class DebugController extends Component{
  constructor(speed = 1.0){
    super();
    this.speed = speed;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.debugController = this;
  }

  Update(){

    let x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
    let y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
    let v = new Vec2(x,y);
    v.Norm();
    v.Scale(this.speed*manager.delta);
    this.gameobj.transform.position.Add(v)
  }

  Destroy(){

  }
}
