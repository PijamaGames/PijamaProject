class AppleController extends Component{
  constructor(){
    super();
    this.type = "appleController";

    this.timeLimit=10;
    this.appleImpulse=10;
    this.startCoolDown=false;
    this.contTime=0;
  }

  Update(){
    if(this.startCoolDown){
      this.contTime+=manager.delta;
    }
    if(this.gameobj.active && this.contTime>=this.timeLimit){
      this.gameobj.SetActive(false);
      this.startCoolDown=false;
    }
  }

  MissileMove(missile,target) {
    let axis = Vec2.Sub(target.transform.GetWorldPos(), missile.transform.GetWorldPos());
    let movement = axis.Scale(this.appleImpulse);
    missile.rigidbody.force.Add(movement);
  }
  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.appleController = this;
  }

}
