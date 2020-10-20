class Camera extends Component {
  constructor() {
    super();
    this.type = "camera";
    this.colorFilter = new Float32Array([1, 1, 1, 1]);
    this.brightness = 1.15;
    this.contrast = 1.1;
  }

  Update() {
    return;
    const step = 2.0;
    if(input.GetKeyDown('KeyT'))
      lighting.SetMorning();
    if(input.GetKeyDown('KeyG'))
      lighting.SetAfterNoon();
    if(input.GetKeyDown('KeyY'))
      lighting.SetNoon();
    if(input.GetKeyDown('KeyH'))
      lighting.SetNight();

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
