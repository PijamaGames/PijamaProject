class Camera extends Component {
  constructor(speed = 2.5) {
    super();
    this.type = "camera";
    this.colorFilter = new Float32Array([1, 1, 1, 1]);
    this.brightness = 1.15;
    this.contrast = 1.1;

    this.target = new Vec2();
    this.speed = speed;
  }

  Update() {
    //Log("CAM UPDATE");
    if(user && user.isClient) return;
    this.UpdateCam(manager.delta);
  }

  UpdateCam(delta){
    let worldPos = this.gameobj.transform.GetWorldPos().Copy();
    let dir = Vec2.Sub(this.target, worldPos).Scale(this.speed*delta);
    this.gameobj.transform.SetWorldPosition(worldPos.Add(dir));
  }

  SetColorFilter(r = 1.0, g = 1.0, b = 1.0) {
    this.colorFilter[0] = r;
    this.colorFilter[1] = g;
    this.colorFilter[2] = b;
  }

  SetGameobj(gameobj) {
    this.gameobj = gameobj;
    this.gameobj.camera = this;
  }
}
