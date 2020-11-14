class ColibriController extends Component {
  constructor() {
    super();
    this.type = "colibriController";
    this.maxDistance = 7.5;
    this.speed = 2.0;
    this.targetThreshold = 0.5;
    this.dir = new Vec2(0, -1);
    this.comingBack = false;
    this.player = null;
    this.velocity = new Vec2();
    this.target = new Vec2();
    this.maxLifeTime = 5.0;
    this.lifeTime = 0.0;
  }

  Update() {
    if(user && user.isClient) return;
    this.lifeTime += manager.delta;
    if(this.lifeTime > this.maxLifeTime){
      this.ComeBack();
    }
    let distToTarget = Vec2.Distance(this.gameobj.transform.GetWorldPos(), this.target);
    if (distToTarget < this.targetThreshold) {
      if (!this.comingBack) {
        this.comingBack = true;
        Log("colibri coming back");
      } else {
        this.ComeBack();
      }
    }
    if (this.player != null && this.comingBack) {
      let playerPos = this.player.transform.GetWorldFloor();
      this.dir = Vec2.Sub(playerPos, this.gameobj.transform.GetWorldPos()).Norm();
      this.velocity.Set(this.dir.x * this.speed, this.dir.y * this.speed);
      this.target.Set(playerPos.x, playerPos.y);
    }

    this.dir = Vec2.Sub(this.target, this.gameobj.transform.GetWorldPos()).Norm();
    this.velocity.Set(this.dir.x * this.speed, this.dir.y * this.speed);
    this.gameobj.rigidbody.force.Add(this.velocity);
    this.gameobj.renderer.SetDirection(this.gameobj.rigidbody.velocity);
  }

  ComeBack(){
    this.gameobj.SetActive(false);
    this.player.playerController.hasColibri = true;
    this.comingBack = false;
    this.gameobj.audioSource.StopAll();
    this.gameobj.rigidbody.force.Set(0,0);
    this.gameobj.rigidbody.velocity.Set(0,0);
    this.lifeTime = 0.0;
  }

  SetLocalPosDir(dir) {
    this.gameobj.transform.SetWorldCenter(this.player.transform.GetWorldFloor());
    let wp = this.gameobj.transform.GetWorldCenter();
    this.dir = Vec2.Norm(dir);
    //this.target = Vec2.dsScale(this.dir, this.maxDistance).Add(wp);
    this.velocity.Set(this.dir.x * this.speed, this.dir.y * this.speed);
    this.target = Vec2.Scale(this.dir, this.maxDistance).Add(wp);
  }

  SetGameobj(gameobj) {
    this.gameobj = gameobj;
    this.gameobj.colibriController = this;
  }
}
