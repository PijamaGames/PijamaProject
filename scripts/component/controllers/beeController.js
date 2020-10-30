class BeeController extends Component{
  constructor(){
    super();
    this.target = null;
    this.speed = 3.0;
    this.randomNess = 1.0;
    this.player = null;
    this.randomVec = new Vec2();
    this.threshold = 0.3;
  }

  Update(){

    if(!this.target || this.target == null || this.target.scene != this.gameobj.scene){ //If not target
      if(this.player){
        this.player.playerController.BeePoolAdd(this.gameobj);
      }
    } else {
      let dir = Vec2.Sub(this.target.transform.GetWorldPos(), this.gameobj.transform.GetWorldPos());
      if(dir.mod < this.threshold){
        //TARGET GETS DAMAGE
        if(this.player){
          this.player.playerController.BeePoolAdd(this.gameobj);
        }
      } else {
        let force = dir;
        force.Norm().Scale(this.speed);
        this.randomVec.Set(Math.Random()-0.5, Math.Random()-0.5);
        this.randomVec.Scale(this.randomNess);
        force.Add(this.randomVec);
        this.gameobj.rigidbody.force.Add(force);
      }
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.beeController = this;
  }

  SetTarget(enemy){
    this.target = enemy;
  }
}
