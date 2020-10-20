class Camera extends Component {
  constructor() {
    super();
    this.type = "camera";
    this.colorFilter = new Float32Array([1, 1, 1, 1]);
    this.brightness = 1.2;
    this.contrast = 1.1;
    this.ambientLight = new Float32Array([0.4, 0.4, 1.3, 1.0]);
    this.shadowStrength = 1.5;
    this.shadowLength = /*-0.5*//*3.0*/-0.3;
    this.minShadowLength = -1.5;
    this.verticalShadowStrength = 0.12;
    this.sunTemperature = 1.0;
    this.shadowBlur = 0.2;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
  }

  SetSunTemperature(temp) {
    this.sunTemperature = clamp(temp, 0.0, 1.0);
  }

  SetShadowLength(shadowLength) {
    this.shadowLength = shadowLength;
    if (this.shadowLength < this.minShadowLength) this.shadowLength = this.minShadowLength;
  }

  Update() {
    //return;
    const step = 2.0;
    let fStep = step * manager.delta;
    if (input.GetKeyPressed('KeyY')) {
      this.SetShadowLength(this.shadowLength - fStep);
    } else if (input.GetKeyPressed('KeyH')) {
      this.SetShadowLength(this.shadowLength + fStep);
    }
    return;
    if (input.GetKeyPressed('KeyT')) {
      this.verticalShadowStrength += fStep;
    } else if (input.GetKeyPressed('KeyG')) {
      console.log('h');
      this.verticalShadowStrength -= fStep;
    }
    return;
    if (this.brightness > 1.2) this.brightness = 1.2;
    if (this.brightness < 0.0) this.brightness = 0.0;
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
