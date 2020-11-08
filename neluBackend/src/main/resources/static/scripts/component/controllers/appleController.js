class AppleController extends Component{
  constructor(){
    super();
    this.type = "appleController";

    this.timeLimit=5;
    this.appleImpulse=20;
    this.startCoolDown=false;
    this.contTime=0;
  }

  Update(){
    if(this.startCoolDown){
      this.contTime+=manager.delta;
    }
    if(this.gameobj.active && this.contTime>=this.timeLimit){
      this.gameobj.SetActive(false);
      this.enemy.enemyController.PoolAdd(this.gameobj);
      //this.startCoolDown=false;
      //this.contTime=0;
    }
  }

  MissileMove(missile,target) {
    let axis = Vec2.Sub(target.transform.GetWorldFloor().Copy(), missile.transform.GetWorldCenter().Copy());
    let movement = axis.Scale(this.appleImpulse);
    missile.rigidbody.force.Add(movement);
  }
  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.appleController = this;
  }

}
