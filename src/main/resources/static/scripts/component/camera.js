class Camera extends Component {
  constructor(speed = 2.5) {
    super();
    this.type = "camera";
    this.colorFilter = new Float32Array([1, 1, 1, 1]);
    this.brightness = 1.15;
    this.maxBrightness = this.brightness;
    this.contrast = 1.1;

    this.target = new Vec2();
    this.speed = speed;
    this.fading = false;
    this.onEndTransition = function(){};
  }

  FadeOut(time, func=function(){}, fromDefault = true){
    if(fromDefault){
      this.brightness = this.maxBrightness;
    }
    this.originalBrightness = this.brightness;
    this.targetBrightness = 0.0;
    this.maxTime = time;
    this.time = 0.0;
    this.fading = true;
    this.onEndTransition = func;
  }

  FadeIn(time,func=function(){}, fromDefault = true){
    if(fromDefault){
      this.brightness = 0.0;
    }
    this.originalBrightness = this.brightness;
    this.targetBrightness = this.maxBrightness;
    this.maxTime = time;
    this.time = 0.0;
    this.fading = true;
    this.onEndTransition = func;
  }

  Update() {
    if(this.fading){
      this.time += manager.delta;
      if(this.time >= this.maxTime){
        this.fading = false;
        this.transitioning = false;
        this.brightness = this.targetBrightness;
        this.onEndTransition();
      } else {
        let lerp = this.time / this.maxTime;
        if(lerp > 1.0){
          lerp = 1.0;
        }
        lerp = lerp*lerp*(3.0-2.0*lerp);
        this.brightness = this.originalBrightness * (1.0-lerp) + this.targetBrightness * lerp;
      }
    }

    //if(user && user.isClient) return;
    this.UpdateCam(manager.delta);
  }

  UpdateCam(delta){
    //Log("updating cam");
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
