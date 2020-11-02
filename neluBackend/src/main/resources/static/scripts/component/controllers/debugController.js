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
    const step =2.0;
    let fStep = step * manager.delta;
    if(input.GetKeyPressed('KeyT')){
      this.gameobj.transform.height+=fStep;
    } else if(input.GetKeyPressed('KeyG')){
      this.gameobj.transform.height-= fStep;
    }
    //return;
    let x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
    let y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
    let v = new Vec2(x,y);
    v.Norm();
    v.Scale(this.speed*manager.delta);
    this.gameobj.transform.position.Add(v)
    /*this.gameobj.transform.position.Set(
      input.mouseGridPosition.x,
      input.mouseGridPosition.y
    )*/
  }

  Destroy(){

  }
}
