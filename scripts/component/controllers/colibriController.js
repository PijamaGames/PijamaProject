class ColibriController extends Component {
  constructor() {
    super();
    this.type = "colibriController";
    this.maxDistance = 7.0;
    this.speed = 1.2;
    this.targetThreshold = 0.3;
    this.dir = new Vec2(0, -1);
    this.comingBack = false;
    this.player = null;
    this.velocity = new Vec2();
    this.target = new Vec2();
  }

  Update() {
    let distToTarget = Vec2.Distance(this.gameobj.transform.GetWorldPos(), this.target);
    if (distToTarget < this.targetThreshold) {
      if (!this.comingBack) {
        this.comingBack = true;
      } else {
        this.ComeBack();
      }
    }
    if (this.player != null && this.comingBack) {

      let playerPos = this.player.transform.GetWorldPos();
      this.dir = Vec2.Sub(playerPos, this.gameobj.transform.GetWorldPos()).Norm();
      this.velocity.Set(this.dir.x * this.speed, this.dir.y * this.speed);
      this.target.Set(playerPos.x, playerPos.y);
    }

    this.gameobj.rigidbody.force.Add(this.velocity);
    this.gameobj.renderer.SetDirection(this.gameobj.rigidbody.velocity);
  }

  ComeBack(){
    this.gameobj.SetActive(false);
    this.player.playerController.hasColibri = true;
    this.comingBack = false;
    this.gameobj.rigidbody.force.Set(0,0);
    this.gameobj.rigidbody.velocity.Set(0,0);
  }

  SetLocalPosDir(localPos, dir) {
    this.gameobj.transform.SetWorldPosition(Vec2.Add(this.player.transform.GetWorldPos(),localPos));
    let wp = this.gameobj.transform.GetWorldPos();
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
