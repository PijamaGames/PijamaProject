class ColibriController extends Component{
  constructor(){
    super();
    this.type = "colibriController";
    this.maxDistance = 8.0;
    this.speed = 3.0;
    this.targetThreshold = 0.3;
    this.dir = new Vec2(0,-1);
    this.comingBack = false;
    this.player = null;
    this.velocity = new Vec2();
  }

  Update(){
    if(this.player!=null && !this.comingBack){
      let distToTarget = Vec2.Distance(this.gameobj.transform.GetWorldPos(), this.target);
      if(distToTarget < this.targetThreshold){
        this.comingBack = true;
      }
    } else if(this.player != null && this.comingBack){
      this.dir = Vec2.Sub(this.player.transform.GetWorldPos(), this.gameobj.transform.GetWorldPos()).Norm();
      this.velocity.Set(this.dir.x*this.speed, this.dir.y*this.speed);
    }

    this.gameobj.rigidbody.force.Add(this.velocity);

  }

  SetLocalPosDir(localPos, dir){
    this.gameobj.transform.SetLocalPosition(localPos);
    let wp = this.gameobj.transform.GetWorldPos();
    this.dir = Vec2.Norm(dir);
    //this.target = Vec2.dsScale(this.dir, this.maxDistance).Add(wp);
    this.velocity.Set(this.dir.x*this.speed, this.dir.y*this.speed);
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.colibriController = this;
  }
}
